<script setup lang="ts">
import { onMounted } from 'vue'
const book = defineProps<{
  title: string
  genre?: string
  creator?: string
  language?: string
  coverUrl?: string | null
  description?: string
}>()
</script>

<template>
  <div class="card card-side h-48 w-full bg-base-100 shadow-sm md:w-1/2 lg:w-1/3">
    <figure class="w-1/3">
      <img
        :src="
          book.coverUrl ??
          'https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp' // TODO: replace fallback img
        "
        alt="Movie"
        class="h-full w-full object-cover"
      />
    </figure>
    <div class="card-body flex w-2/3 flex-col overflow-hidden">
      <h2 class="card-title">{{ book.title }}</h2>
      <span class="text-neutral-content">{{ book.creator }}</span>

      <p>{{ book.genre }}</p>

      <p class="text-ellipsis">{{ book.description }}</p>

      <div class="card-actions justify-end">
        <button class="btn btn-accent">Read</button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
