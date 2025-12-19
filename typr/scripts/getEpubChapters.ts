import ePub from 'epubjs'
import type Section from 'epubjs/types/section'

export interface Chapter {
  title: string
  content: string
}

export async function getEpubChapters(epubPath: string | ArrayBuffer): Promise<Chapter[]> {
  const book = ePub(epubPath)
  await book.ready

  const ignoredSections = new Set<string>([
    'text/titlepage.xhtml',
    'text/imprint.xhtml',
    'text/dedication.xhtml',
    'text/preface.xhtml',
    'text/halftitlepage.xhtml',
    'text/endnotes.xhtml',
    'text/colophon.xhtml',
    'text/uncopyright.xhtml',
  ])

  const sectionPromises: Promise<Chapter | null>[] = []

  book.spine.each((section: Section) => {
    const sectionPromise = (async () => {
      if (ignoredSections.has(section.href)) return null

      const chapterDoc = await book.load(section.href)
      if (!(chapterDoc instanceof Document) || !chapterDoc.body) return null

      // Extract title from the first heading
      const heading = chapterDoc.body.querySelector('h1, h2, h3, h4, h5, h6')
      const title = heading?.textContent?.trim() || section.href

      // Extract full text
      const tempWrapper = document.createElement('div')
      tempWrapper.style.whiteSpace = 'pre'
      tempWrapper.appendChild(chapterDoc.body.cloneNode(true))
      const content = tempWrapper.textContent?.trim() || ''

      if (!content) return null

      return { title, content }
    })()

    sectionPromises.push(sectionPromise)
  })

  const chapters = await Promise.all(sectionPromises)
  return chapters.filter((c): c is Chapter => c !== null)
}
