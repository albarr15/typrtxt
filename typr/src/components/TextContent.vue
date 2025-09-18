<script setup lang="ts">
import { ref, defineProps, watch, onMounted } from 'vue'

const textContent = defineProps({
  content: String,
})

let typed_id = ref(0) // id of the last typed character

const charMap = ref(
  textContent.content?.split('').map((char, idx) => {
    let textChar = {
      id: idx,
      char: char,
      displayChar: char,
      done: false,
      correct: false,
    }
    return textChar
  }) ?? [],
)

const caret = ref<HTMLElement | null>(null)

watch(typed_id, (newId) => {
  // Animating text cursor
  const textContent = document.getElementById('text-content')
  const container = document.getElementById('text-content')?.parentElement
  const currentCharSpan = document.getElementById('char-' + newId)

  if (!currentCharSpan || !textContent || !container) return

  var containerPos = container.getBoundingClientRect()
  var textContentPos = textContent.getBoundingClientRect()
  var currentCharPos = currentCharSpan.getBoundingClientRect()

  const containerCenter = containerPos.top + containerPos.height / 2

  if (caret.value) {
    if (currentCharPos.top > containerCenter) {
      currentCharSpan.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }

    caret.value.style.top = `${currentCharSpan.offsetTop - 5}px`
    console.log('New ID: ' + newId, ' Current Char: ' + currentCharSpan.innerText)

    console.log('chacrater at last: ', charMap.value[newId])

    caret.value.style.left = `${currentCharSpan.offsetLeft - 10}px`

    console.log(currentCharSpan)
  }
})

onMounted(() => {
  // Animating text cursor
})

window.addEventListener('keydown', (event) => {
  if (event.defaultPrevented) {
    return // Do nothing if the event was already processed
  }

  event.preventDefault()

  // console.log('Key pressed: ' + event.key)
  // console.log('Typed id: ' + typed_id.value)

  const current_char = charMap.value.find((x) => x.id === typed_id.value)
  if (!current_char) return

  if (event.key === 'Backspace') {
    if (typed_id.value === 0) return
    typed_id.value--
    const previousChar = charMap.value.find((x) => x.id === typed_id.value)
    if (!previousChar) return
    previousChar.done = false
    previousChar.displayChar = previousChar.char
    previousChar.correct = false
    return
  }

  if (event.key === ' ') {
    typed_id.value++
    current_char.done = true
    current_char.displayChar = ' '
    if (current_char.char === ' ') {
      current_char.correct = true
    } else {
      current_char.correct = false
      current_char.displayChar = '_'
    }
    return
  }

  if (event.key.length === 1) {
    typed_id.value++
    current_char.done = true

    current_char.displayChar = event.key
  }
  if (event.key === current_char.char) {
    current_char.correct = true
  } else {
    current_char.correct = false
  }
})
</script>

<template>
  <div
    tabindex="0"
    class="h-full w-full cursor-text overflow-y-auto px-6 font-mono text-4xl/12 font-medium text-clip text-base-content/60 select-none focus:outline-hidden"
  >
    <div id="text-content" class="relative">
      <span class="absolute animate-pulse text-5xl font-semibold text-primary" ref="caret">|</span>
      <span
        class="whitespace-pre-wrap"
        :class="{
          correct: char.correct,
          incorrect: char.done && !char.correct,
          'text-ghost': !char.done,
        }"
        :id="'char-' + char.id"
        v-for="char in charMap"
        :key="char.id"
        >{{ char.displayChar }}</span
      >
    </div>
  </div>
</template>

<style scoped>
.correct {
  color: var(--color-base-content);
  font-weight: semi-bold;
}
.incorrect {
  color: var(--color-error);
}
</style>
