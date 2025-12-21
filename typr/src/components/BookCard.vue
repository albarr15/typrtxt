<script setup lang="ts">
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
</script>

<template>
  <router-link :to="`/test/${book.id}`">
    <div
      class="card card-side h-60 w-full min-w-[430px] border border-base-content/10 bg-base-100 shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-xl"
    >
      <figure class="w-40 shrink-0">
        <img :src="book.cover_url" alt="Book Cover" class="h-full w-full object-cover" />
      </figure>

      <div class="card-body flex h-full flex-1 flex-col overflow-hidden">
        <h1 class="card-title line-clamp-2">{{ book.title }}</h1>

        <div class="flex justify-between text-sm">
          <span class="truncate">{{ book.creator }}</span>
          <span class="truncate">{{ book.subject }}</span>
        </div>

        <p class="line-clamp-6 flex-1 text-sm">{{ book.description }}</p>

        <div class="flex justify-start gap-2" id="book-tags">
          <div v-if="book.word_count" class="badge badge-ghost badge-sm">
            {{ lengthLabel(book.word_count) }}
          </div>
          <div v-if="book.reading_ease" class="badge badge-ghost badge-sm">
            {{ readingEaseLabel(book.reading_ease) }}
          </div>
        </div>
      </div>
    </div>
  </router-link>
</template>

<style scoped></style>
