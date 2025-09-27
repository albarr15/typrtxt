<script setup lang="ts">
import BookCard from '../components/BookCard.vue'
import { onMounted } from 'vue'
import ePub from 'epubjs'

interface Book {
  name: string
  path: string
}

onMounted(async () => {
  console.log('Fetching booklist ...')
  try {
    const response = await fetch('/booksList.json')
    const booksFileList: Book[] = await response.json()

    console.log('Processing books ...')

    for (const b of booksFileList) {
      try {
        const book = ePub(b.path)

        await book.ready

        console.log('Found ' + b.name)

        book.loaded.metadata
          .then(function (meta) {
            console.log('Book Title:', meta.title)
            console.log('Author:', meta.creator)
            console.log('Description:', meta.description)
            console.log('Publisher:', meta.publisher)
            console.log('Language:', meta)
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
      <BookCard />
    </div>
  </div>
</template>

<style scoped></style>
