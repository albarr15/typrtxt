<script setup lang="ts">
import BookCard from '../components/BookCard.vue'
import { onMounted, ref, computed } from 'vue'
import { supabase } from '../lib/supabaseClient'

interface BookInfo {
  identifier: string
  path: string
  title: string
  creator?: string
  language: string
  description?: string
  publisher?: string
  cover_url?: string
  subject?: string | undefined
  subjects?: string | string[] | undefined
  word_count?: string | undefined
  reading_ease?: string | undefined
}

let books = ref<BookInfo[]>([])

onMounted(async () => {
  const { data, error }: { data: BookInfo[] | null; error: any } = await supabase
    .from('books')
    .select()

  console.log('Data:', data)

  if (error) {
    console.error('Error fetching books: ', error)
    return
  }

  books.value = data || []
})

// console.log(books.value)

const searchQuery = ref('')

const searchedBooks = computed(() => {
  if (!books) return []

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
        :path="b.path"
        :title="b.title"
        :subjects="b.subjects"
        :subject="b.subject"
        :creator="b.creator"
        :language="b.language"
        :cover_url="b.cover_url"
        :description="b.description"
        :word_count="b.word_count"
        :reading_ease="b.reading_ease"
      />
    </div>
    <h1 v-else class="text-center">No books found.</h1>
  </div>
</template>

<style scoped></style>
