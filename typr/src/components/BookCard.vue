<script setup lang="ts">
import { computed, onMounted } from 'vue'

const book = defineProps<{
  identifier: string
  title: string
  creator?: string
  language: string
  description?: string
  publisher?: string
  coverUrl?: string | null
  date?: Date
  subjects?: string | string[] | undefined
  subject: string | undefined
  wordCount?: string
  readingEase?: string
}>()

const readingEaseLabel = (score: string | null) => {
  const readingEaseNum = Number(score)

  if (!readingEaseNum) return null
  if (readingEaseNum <= 29) return 'Very confusing'
  if (readingEaseNum <= 49) return 'Difficult'
  if (readingEaseNum <= 59) return 'Fairly difficult'
  if (readingEaseNum <= 69) return 'Standard'
  if (readingEaseNum <= 79) return 'Fairly easy'
  if (readingEaseNum <= 89) return 'Easy'
  return 'Very easy'
}

const lengthLabel = (wordCount: string | null) => {
  const wordCountNum = Number(wordCount)

  if (!wordCountNum) return null
  if (wordCountNum <= 80000) return 'Short (<80,000 words)'
  if (wordCountNum <= 120000) return 'Medium (< 120,000 words)'
  return 'Long (> 120,000 words)'
}
</script>

<template>
  <div class="card card-side h-60 w-full border-base-200 bg-base-100 shadow-md">
    <figure class="w-40 shrink-0">
      <img
        :src="
          book.coverUrl ??
          'https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp' // TODO: replace fallback img
        "
        alt="Movie"
        class="h-full w-full object-cover"
      />
    </figure>
    <div class="h-fit-content card-body h-59 w-2/3 flex-col">
      <h1 class="card-title">{{ book.title }}</h1>
      <div class="flex justify-between">
        <span>Author: {{ book.creator }}</span>
        <span>Genre: {{ book.subject }}</span>
      </div>

      <p class="line-clamp-2">{{ book.description }}</p>

      <div class="flex justify-start gap-2" id="book-tags">
        <div v-if="book.wordCount" class="badge badge-ghost">
          {{ lengthLabel(book.wordCount) }}
        </div>
        <div v-if="book.readingEase" class="badge badge-ghost">
          {{ readingEaseLabel(book.readingEase) }}
        </div>
      </div>
      <div class="card-actions justify-end">
        <router-link to="/book"><button class="btn btn-primary">Read</button></router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media only screen and (max-width: 1026px) {
  #book-tags {
    display: none;
  }
}
</style>
