<script setup lang="ts">
import { ref, watch, onMounted, reactive, computed } from 'vue'

const textContent = defineProps({
  content: String,
})

let typed_id = ref(0) // id of the last typed character
let last_typed_time = ref(Date.now())
let timer_running = ref(false)
let running_time = ref(0) // in seconds

let emit = defineEmits(['current_running_time', 'updateStats'])
emit('current_running_time', running_time.value)

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

var stats = computed(() => {
  const minutes = running_time.value / 60
  const typedChars = charMap.value.filter((c) => c.done).length
  const incorrectChars = charMap.value.filter((c) => c.done && !c.correct).length

  const grossWPM = typed_id.value / 5
  const netWPM = minutes > 0 ? (grossWPM - incorrectChars) / minutes : 0

  const correctChars = charMap.value.filter((c) => c.done && c.correct).length
  const accuracy = Math.round((correctChars / typedChars) * 100) || 0

  return {
    grossWPM: Math.round(grossWPM) || 0,
    netWPM: Math.round(netWPM) || 0,
    typedChars: typedChars,
    correctChars: correctChars,
    incorrectChars: incorrectChars,
    accuracy: accuracy,
    minutes: minutes,
  }
})

const caret = ref<HTMLElement | null>(null)

watch(typed_id, (newId) => {
  emit('updateStats', stats.value)

  // start test timer
  last_typed_time.value = Date.now()

  if (!timer_running.value) {
    startTimer()
  }

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
    // console.log('New ID: ' + newId, ' Current Char: ' + currentCharSpan.innerText)

    // console.log('chacrater at last: ', charMap.value[newId])

    caret.value.style.left = `${currentCharSpan.offsetLeft - 10}px`

    // console.log(currentCharSpan)
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
  // console.log('Typed id: ' + typed_id.value)

  // console.log('Key pressed: ' + event.key)

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

function startTimer() {
  var start = Date.now()
  timer_running.value = true
  console.log('Timer started')

  if (running_time.value > 0) {
    start = start - running_time.value * 1000 // continue from previous time (deducted 5s of inactivity)
  }

  var intervalId = setInterval(() => {
    // stop timer when no presses detected for 5 seconds
    if (Date.now() - last_typed_time.value > 5000) {
      alert('Timer stopped')
      clearInterval(intervalId)

      running_time.value -= 5 // deduct 5s of inactivity + end of current second
      timer_running.value = false

      emit('current_running_time', running_time.value)
      return
    }

    if (textContent.content?.length === typed_id.value) {
      alert('Test completed!')
      clearInterval(intervalId)
      timer_running.value = false
      return
    }

    var delta = Date.now() - start
    // console.log('Timer: ' + Math.floor(delta / 1000) + 's')
    running_time.value = Math.floor(delta / 1000)
    emit('current_running_time', running_time.value)
  }, 200)
}
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
