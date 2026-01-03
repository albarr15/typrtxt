<script setup lang="ts">
import { onMounted, ref } from 'vue'

const text = ref('Great books, greater typing.')
const text_shown = ref('')

function typeText() {
  if (text.value.length > text_shown.value.length) {
    text_shown.value += text.value.charAt(text_shown.value.length)
    setTimeout(
      () => {
        typeText()
      },
      Math.floor(Math.random() * 100) + 50,
    ) // Random delay
  }
}

onMounted(() => typeText())
</script>

<template>
  <div class="hero">
    <div class="hero-content text-center">
      <div class="max-w-md">
        <h1 class="text-6xl font-bold">{{ text_shown }}</h1>
        <p class="py-6">
          Practice typing with passages from Frankenstein, Pride and Prejudice, and more classic
          novels.
          <br />
          <br />

          <span class="text-sm font-light"
            >Note: Physical keyboard required for maintaining typing integrity.</span
          >
        </p>
        <router-link to="/lib"
          ><button class="btn btn-primary">Type Out A Book</button></router-link
        >
      </div>
    </div>
  </div>
</template>

<style scoped></style>
