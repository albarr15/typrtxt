<script setup lang="ts">
import BookCard from '../components/BookCard.vue'
import FilterModal from '../components/FilterModal.vue'
import { onMounted, ref, watch, computed } from 'vue'
import { supabase } from '../lib/supabaseClient'

interface BookInfo {
  id: number
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

const currentPage = ref<number>(1)
const booksPerPage = ref<number>(20)
const totalPages = ref<number>(1)
const count = ref<number>(0)

let indexStart = ref<number>(0)
let indexEnd = ref<number>(0)

const handleFetch = async () => {
  try {
    loading.value = true

    let query = supabase.from('books').select('*', { count: 'exact' })
    const filters: string[] = []

    if (selected_genres.value.length > 0) {
      const genreFilter = selected_genres.value.map((genre) => `subject.eq.${genre}`).join(',')
      filters.push(genreFilter)
    }

    if (selected_authors.value.length > 0) {
      const authorFilter = selected_authors.value.map((author) => `creator.eq.${author}`).join(',')
      filters.push(authorFilter)
    }

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

    if (searchQuery.value != '') {
      query = query.ilike('title', `%${searchQuery.value}%`)
    }

    if (filters.length > 0) {
      const allFilters = filters.join(',')
      query = query.or(allFilters)
    }

    const {
      data,
      error,
      count: queryCount,
      status,
    } = await query.order('title', { ascending: true })

    indexStart = computed(() => {
      return (currentPage.value - 1) * booksPerPage.value
    })

    indexEnd = computed(() => {
      return currentPage.value * booksPerPage.value
    })

    if (error && status !== 406) throw error
    if (data) {
      if (queryCount == null) {
        count.value = 0
        return
      }

      totalPages.value = queryCount ? Math.ceil(queryCount / booksPerPage.value) : 1

      if (data.length > booksPerPage.value) {
        fetchedBooks.value = data.slice(indexStart.value, indexEnd.value)
      } else {
        fetchedBooks.value = data
      }

      count.value = queryCount
    }
  } catch (error) {
    console.error('Error fetching books:', error)
  } finally {
    loading.value = false
  }
}

const searchQuery = ref('')

watch(searchQuery, () => {
  currentPage.value = 1
  handleFetch()
})

function changePage(selectedPage: number) {
  currentPage.value = selectedPage
  handleFetch()
}

function filterGenre(selectedGenres: string[]) {
  currentPage.value = 1

  selected_genres.value = selectedGenres
  console.log('Selected genres:', selected_genres.value)
  handleFetch()
}

function filterAuthor(selectedAuthors: string[]) {
  currentPage.value = 1

  selected_authors.value = selectedAuthors
  console.log('Selected authors:', selected_authors.value)
  handleFetch()
}

function filterLength(selectedLengths: string[]) {
  currentPage.value = 1

  selected_lengths.value = selectedLengths
  console.log('Selected lengths:', selected_lengths.value)
  handleFetch()
}

function filterReadingEase(selectedReadingEase: string[]) {
  currentPage.value = 1

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
        <input type="search" ref="searchInput" placeholder="Search..." v-model="searchQuery" />
      </label>
      <FilterModal
        @filter_genres="filterGenre"
        @filter_authors="filterAuthor"
        @filter_lengths="filterLength"
        @filter_reading_ease="filterReadingEase"
      />
    </div>
    <span v-if="loading" class="loading mx-auto loading-xl loading-spinner"></span>
    <div v-if="!loading" class="flex justify-between">
      Displaying {{ count > 0 ? indexStart + 1 : 0 }} to {{ Math.min(indexEnd, count) }} /
      {{ count }} books

      <div class="join">
        <button
          class="btn join-item"
          v-for="page in totalPages"
          :key="page"
          @click="changePage(page)"
          :class="{ 'btn-active': currentPage === page }"
        >
          {{ page }}
        </button>
      </div>
    </div>

    <div
      v-if="fetchedBooks.length > 0 && !loading"
      class="grid grid-cols-1 gap-6 xl:grid-cols-2 2xl:grid-cols-3"
    >
      <BookCard
        v-for="b in fetchedBooks"
        :key="b.id"
        :id="b.id"
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
