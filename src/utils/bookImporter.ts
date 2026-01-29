import ePub from 'epubjs'
import { supabase } from '../lib/supabaseClient'

// to be used within Library.vue for importing books into the database

interface ExtendedMetadata {
  [key: string]: string | string[] | undefined
  subjects?: string[]
}

interface BookListItem {
  name: string
  path: string
}

export async function importBooks() {
  const bookListPath = '/booksList.json'

  console.log('Fetching booklist ...')
  try {
    const response = await fetch('/booksList.json')
    const bookPathList: BookListItem[] = await response.json()

    console.log('Processing books ...')

    for (const bookPath of bookPathList) {
      try {
        console.log(bookPath)

        const foundBook = ePub(bookPath.path)
        await foundBook.ready

        console.log('Book is ready ...')

        const packaging = foundBook.packaging
        const metadata = packaging.metadata

        // for fetching standardebooks metadata hidden from ePub.js
        let extendedMetadata: ExtendedMetadata = {}

        try {
          let opfPath = (packaging as any).packagePath

          // If not available, try to get it from the container
          if (!opfPath && foundBook.container) {
            opfPath = (foundBook.container as any).packagePath
          }

          console.log('Attempting to read OPF from:', opfPath)

          // Try to get the file from the archive
          let opfXml

          if (!opfXml && (foundBook.archive as any).zip) {
            const zipFile = (foundBook.archive as any).zip.file(opfPath)
            if (zipFile) {
              opfXml = await zipFile.async('text')
            }
          }

          if (opfXml) {
            console.log('Successfully read OPF file!')

            // Parse the XML
            const parser = new DOMParser()
            const opfDoc = parser.parseFromString(opfXml, 'application/xml')

            // Get the metadata element
            const metadataElement = opfDoc.querySelector('metadata')

            if (metadataElement) {
              // Extract all meta tags with property attributes
              const metaTags = metadataElement.querySelectorAll('meta[property]')

              metaTags.forEach((meta) => {
                const property = meta.getAttribute('property')
                const value = meta.textContent.trim()
                if (property && value) {
                  extendedMetadata[property] = value
                }
              })

              // Extract dc:subject tags
              const subjects: string[] | undefined = []
              const subjectTags = metadataElement.querySelectorAll('subject')
              subjectTags.forEach((subject) => {
                subjects.push(subject.textContent.trim())
              })
              if (subjects.length > 0) {
                extendedMetadata.subjects = subjects
              }

              console.log('=== Extended Metadata Found ===')
              console.log(extendedMetadata)
            }
          } else {
            console.error('Could not read OPF file ...')
          }
        } catch (xmlError) {
          console.error('Error parsing OPF XML:', xmlError)
        }

        const coverBlob: string | null = await foundBook.coverUrl()

        if (!coverBlob) {
          console.log('No cover found for book:', bookPath)
          continue
        }

        const coverResponse = await fetch(coverBlob)
        const blob = await coverResponse.blob()
        const coverUrl = URL.createObjectURL(blob)

        const coverFileName = `${metadata.identifier}_cover.jpg`

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('epub-covers')
          .upload(coverFileName, blob)

        if (uploadError) {
          // Check if it's a duplicate error
          if (uploadError.message.includes('already exists')) {
            console.log('Cover already exists, using existing:', coverFileName)
            // get the existing URL
          } else {
            console.error('Error uploading cover:', uploadError)
            continue
          }
        }

        const { data: urlData } = supabase.storage.from('epub-covers').getPublicUrl(coverFileName)

        const epubResponse = await fetch(bookPath.path)
        const epubBlob = await epubResponse.blob()

        if (!epubBlob) {
          console.log('No book found:', bookPath)
          continue
        }

        const epubFileName = `${metadata.identifier}.epub`

        const { data: epubUploadData, error: epubUploadError } = await supabase.storage
          .from('epub-files')
          .upload(epubFileName, epubBlob)

        if (epubUploadError) {
          console.error('Error uploading book:', bookPath, epubUploadError)
          continue
        }

        const { data: epubUrlData } = supabase.storage.from('epub-files').getPublicUrl(epubFileName)

        const { error } = await supabase.from('books').insert({
          identifier: metadata.identifier,
          title: metadata.title,
          creator: metadata.creator,
          description: metadata.description,
          publisher: metadata.publisher,
          language: metadata.language,
          path: epubUrlData.publicUrl,
          cover_url: urlData.publicUrl,
          // Add extended metadata
          word_count: extendedMetadata['se:word-count'],
          reading_ease: extendedMetadata['se:reading-ease.flesch'],
          subjects: extendedMetadata.subjects,
          subject: extendedMetadata['se:subject'],
        })

        if (error) {
          console.error('Database insert error: ', error)
          continue
        }

        console.log('Book successfully inserted to books database: ', bookPath.name)
      } catch (error) {
        console.error('Error loading book:', bookPath.name, error)
      }
    }
  } catch (err) {
    console.error('Error processing books: ', err)
  }

  return
}
