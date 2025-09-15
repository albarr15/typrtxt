<script setup lang="ts">
import { ref, watch, computed, defineProps } from 'vue'

const textContent = defineProps({
  content: String,
})

let id = ref(0)
let typed_id = ref(1) // id of the last typed character

const charMap = ref(
  textContent.content?.split('').map((char, idx) => {
    let textChar = {
      id: id.value++,
      char: char,
      displayChar: char,
      done: false,
      correct: false,
    }
    return textChar
  }) ?? [],
)

function highlightText() {
  const allSpans = document.querySelectorAll('span')
  allSpans.forEach((span) => {
    span.classList.add('correct')
  })
}

function handleKeydown(event: KeyboardEvent) {
  // TODO: handle other keys, only consider alphanumeric keys

  const current_char = charMap.value.find((x) => x.id === typed_id.value)
  if (current_char) {
    typed_id.value++
    current_char.done = true

    console.log(current_char?.displayChar)

    if (event.key === ' ') {
      event.preventDefault() // Prevent scrolling when space is pressed
      current_char.displayChar = ' '

      if (current_char.char === ' ') current_char.correct = false
    } else if (
      // event.key in ['Shift', 'CapsLock', 'Tab', 'Control', 'Alt', 'Meta', 'Enter', 'Backspace']
      event.ctrlKey ||
      event.altKey ||
      event.metaKey
    ) {
      // Ignore non-alphanumeric keys
      return
    } else if (event.code === 'Backspace') {
      typed_id.value--
    } else if (event.shiftKey || event.code == 'CapsLock') {
      // skip
    }

    current_char.displayChar = event.key
    if (event.key === current_char.char) {
      current_char.correct = true
    } else {
      current_char.correct = false
    }
  }

  // console.log(current_char?.displayChar)
}
</script>

<template>
  <div
    tabindex="0"
    @keydown="handleKeydown"
    class="cursor-text overflow-hidden px-6 font-mono text-4xl/12 font-medium text-clip text-base-content/60"
  >
    <span class="absolute animate-pulse text-5xl font-semibold text-primary" id="caret">l</span>
    <span
      :class="{
        correct: char.correct,
        incorrect: char.done && !char.correct,
      }"
      v-for="char in charMap"
      :key="char.id"
      >{{ char.displayChar }}</span
    >
  </div>
</template>

<style scoped>
.correct {
  color: var(--color-base-content);
}
.incorrect {
  color: var(--color-error);
}
</style>
