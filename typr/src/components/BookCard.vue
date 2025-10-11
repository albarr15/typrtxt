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
  <div class="card card-side h-48 w-full bg-base-100 shadow-sm md:w-1/2">
    <figure class="w-1/4">
      <img
        :src="
          book.coverUrl ??
          'https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp' // TODO: replace fallback img
        "
        alt="Movie"
        class="object-fill"
      />
    </figure>
    <div class="card-body flex flex-col">
      <h2 class="card-title">{{ book.title }}</h2>
      <span class="text-neutral-content">{{ book.creator }}</span>

      <p>{{ book.genre }}</p>

      <p>{{ book.description }}</p>

      <div class="card-actions justify-end">
        <button class="btn btn-accent">Read</button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
