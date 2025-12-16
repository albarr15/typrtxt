import ePub from 'epubjs'
import type Section from 'epubjs/types/section'

export async function getEpubChapters(epubPath: string | ArrayBuffer): Promise<string[]> {
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

  const sectionPromises: Promise<string>[] = []

  book.spine.each((section: Section) => {
    console.log('Processing section:', section.href)
    const sectionPromise = (async () => {
      if (ignoredSections.has(section.href)) return ''
      const chapter = await book.load(section.href)

      if (!(chapter instanceof Document) || !chapter.body?.textContent) {
        return ''
      }
      return chapter.body.textContent
    })()

    sectionPromises.push(sectionPromise)
  })

  const content = await Promise.all(sectionPromises)
  return content
}
