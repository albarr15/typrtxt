<script setup lang="ts">
import { ref, watch, computed, defineProps } from 'vue'

const textContent = defineProps({
  content: String,
})

let id = 0

class ContentCharacter {
  id: number
  char: string
  displayChar: string
  done: boolean
  correct: boolean

  constructor(id: number, char: string, displayChar: string, done: boolean, correct: boolean) {
    this.id = id++
    this.char = char
    this.displayChar = char
    this.done = done
    this.correct = correct
  }
}

const characters = computed<ContentCharacter[]>(() => {
  return textContent.content
    ? textContent.content
        .split('')
        .map((char, idx) => new ContentCharacter(idx, char, char, false, false))
    : []
})

// const characters = ref([{ id: id++, char: '|', done: false, correct: false }])

function highlightText() {
  const allSpans = document.querySelectorAll('span')
  allSpans.forEach((span) => {
    span.classList.add('correct')
  })
}
</script>

<template>
  <div
    @click="highlightText"
    class="cursor-pointer overflow-hidden px-6 text-4xl/12 font-medium text-clip text-base-content/60"
  >
    <span>|</span>
    <!-- <span v-for="(char, idx) in textContent.content?.split('')" :key="idx">
      <TextChar :typed="false" :correct="false">
        {{ char }}
      </TextChar>
    </span> -->
    <span></span>
    <span v-for="char in characters" :key="char.id">{{ char.char }}</span>
  </div>
</template>

<style scoped>
.correct {
  color: var(--color-purple-400);
}
.incorrect {
  color: var(--error);
}
</style>
