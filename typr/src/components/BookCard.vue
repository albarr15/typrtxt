<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
const book = defineProps<{
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
  if (wordCountNum <= 80000) return 'Short'
  if (wordCountNum <= 120000) return 'Medium'
  return 'Long'
}

// console.log(book.cover_url)

const fetchedBookCover = ref<string>('')
</script>

<template>
  <div class="card card-side h-60 w-full border-base-200 bg-base-100 shadow-md">
    <figure class="w-40 shrink-0">
      <img
        :src="
          book.cover_url ??
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
        <div v-if="book.word_count" class="badge badge-ghost">
          {{ lengthLabel(book.word_count) }}
        </div>
        <div v-if="book.reading_ease" class="badge badge-ghost">
          {{ readingEaseLabel(book.reading_ease) }}
        </div>
      </div>
      <div class="card-actions justify-end">
        <router-link :to="`/book/${book.id}`"
          ><button class="btn btn-primary">Read</button></router-link
        >
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
