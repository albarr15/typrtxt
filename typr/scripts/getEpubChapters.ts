import ePub from 'epubjs'
import type Section from 'epubjs/types/section'

export async function getEpubChapters(epubPath: string | ArrayBuffer): Promise<string[]> {
  const book = ePub(epubPath)
  await book.ready

  const sectionPromises: Promise<string>[] = []

  book.spine.each((section: Section) => {
    const sectionPromise = (async () => {
      const chapter = await book.load(section.href)

      if (!(chapter instanceof Document) || !chapter.body?.textContent) {
        return ''
      }
      return chapter.body.textContent.trim()
    })()

    sectionPromises.push(sectionPromise)
  })

  const content = await Promise.all(sectionPromises)
  return content.filter((text) => text)
}
