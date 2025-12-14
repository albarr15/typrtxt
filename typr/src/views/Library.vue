<script setup lang="ts">
import BookCard from '../components/BookCard.vue'
import { onMounted, ref, computed } from 'vue'
import ePub from 'epubjs'

interface BookInfo {
  identifier: string
  path: string
  title: string
  creator?: string
  language: string
  description?: string
  publisher?: string
  coverUrl?: string | null
  date?: Date
  subject?: string | undefined
  subjects?: string | string[] | undefined
  wordCount?: string | undefined
  readingEase?: string | undefined
}

interface ExtendedMetadata {
  'se:word-count'?: string | undefined
  'se:reading-ease.flesch'?: string | undefined
  'se:subject'?: string | undefined
  subjects?: string | string[] | undefined
  [key: string]: string | string[] | undefined
}

interface BookPath {
  path: string
}

var books = ref<BookInfo[]>([])

onMounted(async () => {
  // console.log('Fetching booklist ...')
  try {
    const response = await fetch('/booksList.json')
    const bookPathList: BookPath[] = await response.json()

    // console.log('Processing books ...')

    for (const b of bookPathList) {
      try {
        const foundBook = ePub(b.path)
        await foundBook.ready

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

          // console.log('Attempting to read OPF from:', opfPath)

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

        const url = await foundBook.coverUrl()

        books.value.push({
          identifier: metadata.identifier,
          path: b.path,
          title: metadata.title,
          creator: metadata.creator,
          description: metadata.description,
          publisher: metadata.publisher,
          language: metadata.language,
          coverUrl: url,
          // Add extended metadata
          wordCount: extendedMetadata['se:word-count'],
          readingEase: extendedMetadata['se:reading-ease.flesch'],
          subjects: extendedMetadata.subjects,
          subject: extendedMetadata['se:subject'],
        })

        console.log('Book added with extended metadata')
      } catch (error) {
        console.error('Error loading book:', b.path, error)
      }
    }
  } catch (err) {
    console.error('Error processing books: ', err)
  }
})

const searchQuery = ref('')

const searchedBooks = computed(() => {
  return books.value.filter((book) => {
    return book.title.toLowerCase().indexOf(searchQuery.value.toLowerCase()) != -1
  })
})
</script>

<template>
  <div class="flex w-[80dvw] flex-col justify-start gap-8 px-5">
    <div class="flex justify-between gap-4">
      <label class="input flex-1">
        <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <g
            stroke-linejoin="round"
            stroke-linecap="round"
            stroke-width="2.5"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </g>
        </svg>
        <input type="search" required placeholder="Search..." v-model="searchQuery" />
      </label>
      <button class="btn shrink-0">Filter</button>
    </div>

    <div v-if="searchedBooks.length > 0" class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <BookCard
        v-for="b in searchedBooks"
        :key="b.identifier"
        :identifier="b.identifier"
        :title="b.title"
        :subjects="b.subjects"
        :subject="b.subject"
        :creator="b.creator"
        :language="b.language"
        :cover-url="b.coverUrl"
        :description="b.description"
        :word-count="b.wordCount"
        :reading-ease="b.readingEase"
      />
    </div>
    <h1 v-else class="text-center">No books found.</h1>
  </div>
</template>

<style scoped></style>
