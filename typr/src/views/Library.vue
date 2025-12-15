<script setup lang="ts">
import BookCard from '../components/BookCard.vue'
import FilterModal from '../components/FilterModal.vue'
import { onMounted, ref } from 'vue'
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

let selected_genres = ref<string[]>([])
let selected_authors = ref<string[]>([])
let selected_lengths = ref<string[]>([])
let selected_reading_ease = ref<string[]>([])

onMounted(() => {
  handleFetch()
})

// TODO: add a loading spinner

const fetchedBooks = ref<BookInfo[]>([])
const loading = ref(true)

const handleFetch = async () => {
  try {
    loading.value = true

    let query = supabase.from('books').select()
    const filters: string[] = []

    if (selected_genres.value.length > 0) {
      const genreFilter = selected_genres.value.map((genre) => `subject.eq.${genre}`).join(',')
      filters.push(genreFilter)
    }

    if (selected_authors.value.length > 0) {
      const authorFilter = selected_authors.value.map((author) => `creator.eq.${author}`).join(',')
      filters.push(authorFilter)
    }

    if (filters.length > 0) {
      const allFilters = filters.join(',')
      query = query.or(allFilters)
    }

    const { data, error, status } = await query

    if (error && status !== 406) throw error
    if (data) {
      fetchedBooks.value = data
    }
  } catch (error) {
    console.error('Error fetching books:', error)
  } finally {
    loading.value = false
  }
}

const searchQuery = ref('')

function filterGenre(selectedGenres: string[]) {
  selected_genres.value = selectedGenres
  console.log('Selected genres:', selected_genres.value)
  handleFetch()
}

function filterAuthor(selectedAuthors: string[]) {
  selected_authors.value = selectedAuthors
  console.log('Selected authors:', selected_authors.value)
  handleFetch()
}

function filterLength(selectedLengths: string[]) {
  selected_lengths.value = selectedLengths
  console.log('Selected lengths:', selected_lengths.value)
  handleFetch()
}

function filterReadingEase(selectedReadingEase: string[]) {
  selected_reading_ease.value = selectedReadingEase
  console.log('Selected reading ease:', selected_reading_ease.value)
  handleFetch()
}
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
      <FilterModal
        @filter_genres="filterGenre"
        @filter_authors="filterAuthor"
        @filter_lengths="filterLength"
        @filter_reading_ease="filterReadingEase"
      />
    </div>

    <div v-if="fetchedBooks.length > 0" class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <BookCard
        v-for="b in fetchedBooks"
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
