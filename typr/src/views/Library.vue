<script setup lang="ts">
import BookCard from '../components/BookCard.vue'
import { onMounted, ref } from 'vue'
import ePub from 'epubjs'

interface BookInfo {
  identifier: string
  path: string
  title: string
  creator?: string
  genre?: string
  language: string
  description?: string
  publisher?: string
  coverUrl?: string | null
  date?: Date
  subject?: string
}

var books = ref<BookInfo[]>([])

onMounted(async () => {
  console.log('Fetching booklist ...')
  try {
    const response = await fetch('/booksList.json')
    let bookPathList = await response.json()

    console.log('Processing books ...')

    for (const b of bookPathList) {
      try {
        const foundBook = ePub(b.path)
        await foundBook.ready

        // console.log('Found ' + b.name)

        foundBook.loaded.metadata
          .then(async function (meta) {
            const url = await foundBook.coverUrl()

            books.value.push({
              identifier: meta.identifier,
              path: b.path,
              title: meta.title,
              creator: meta.creator,
              description: meta.description,
              publisher: meta.publisher,
              language: meta.language,
              coverUrl: url,
            })

            // console.log('Books array:', books.value)

            console.log('Book Title:', meta.title)
            console.log('Author:', meta.creator)
            console.log('Description:', meta.description)
            console.log('Publisher:', meta.publisher)
            console.log('Language:', meta.language)
          })
          .catch(function (error) {
            console.error('Error loading metadata:', error)
          })
      } catch (err) {
        console.error('Error loading book: ', b.name, err)
      }
    }
  } catch (err) {
    console.error('Error processing books: ', err)
  }
})
</script>

<template>
  <div class="flex h-full w-full flex-col justify-start gap-4 bg-gray-500 px-5">
    <label class="input w-full">
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
      <input type="search" required placeholder="Search" />
    </label>

    <div class="grid grid-cols-1 gap-3">
      <BookCard
        v-for="b in books"
        :key="b.path"
        :title="b.title"
        :genre="b.genre"
        :creator="b.creator"
        :language="b.language"
        :cover-url="b.coverUrl"
        :description="b.description"
      />
    </div>
  </div>
</template>

<style scoped></style>
