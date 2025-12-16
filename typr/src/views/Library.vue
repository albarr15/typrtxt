<script setup lang="ts">
import BookCard from '../components/BookCard.vue'
import FilterModal from '../components/FilterModal.vue'
import { onMounted, ref, watch } from 'vue'
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

    // TODO: not working
    if (selected_lengths.value.length > 0) {
      const lengthFilter = selected_lengths.value
        .map((length) => {
          if (length === 'Short (<= 80,000 words)') return 'word_count.lte.80000'
          if (length === 'Medium (<= 120,000)') {
            return 'and(word_count.gt.80000,word_count.lte.120000)'
          }
          if (length === 'Long (> 120,000)') return 'word_count.gt.120000'
        })
        .join(',')
      filters.push(lengthFilter)
      console.log('Length filter:', lengthFilter)
    }

    if (selected_reading_ease.value.length > 0) {
      const readingEaseFilter = selected_reading_ease.value
        .map((re) => {
          if (re === 'Very confusing') return 'reading_ease.lte.29'
          if (re === 'Difficult') return 'and(reading_ease.gt.29,reading_ease.lte.49)'
          if (re === 'Fairly difficult') return 'and(reading_ease.gt.49,reading_ease.lte.59)'
          if (re === 'Standard') return 'and(reading_ease.gt.59,reading_ease.lte.69)'
          if (re === 'Fairly easy') return 'and(reading_ease.gt.69,reading_ease.lte.79)'
          if (re === 'Easy') return 'and(reading_ease.gt.79,reading_ease.lte.89)'
          if (re === 'Very easy') return 'reading_ease.gt.89'
        })
        .join(',')
      filters.push(readingEaseFilter)
    }

    if (searchQuery != '') {
      query = query.ilike('title', `%${searchQuery.value}%`)
    }

    if (filters.length > 0) {
      const allFilters = filters.join(',')
      query = query.or(allFilters)
    }

    console.log('Total query:', query)

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

watch(searchQuery, () => {
  handleFetch()
})

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
    <span v-if="loading" class="loading mx-auto loading-xl loading-spinner"></span>
    Found {{ fetchedBooks.length }} books

    <div v-if="fetchedBooks.length > 0 && !loading" class="grid grid-cols-1 gap-6 lg:grid-cols-2">
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

    <h1 v-if="fetchedBooks.length == 0 && !loading" class="text-center">No books found.</h1>
  </div>
</template>

<style scoped></style>
