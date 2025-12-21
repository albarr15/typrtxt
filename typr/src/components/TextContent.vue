<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed, nextTick } from 'vue'
import { supabase } from '../lib/supabaseClient'
import { BookInfo } from '../types/book'
import { getEpubChapters } from '../../scripts/getEpubChapters'
import { Chapter } from '../../scripts/getEpubChapters'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  chapIdx: {
    type: Number,
    required: true,
  },
})

interface TextChar {
  id: number
  char: string
  displayChar: string
  done: boolean
  correct: boolean
}

const foundBook = ref<BookInfo | null>(null)
const loading = ref<boolean>(true)

const bookContent = ref<Chapter[]>([])
const chapterTitles = ref<string[]>([])
const charMap = ref<TextChar[]>([])
const chapterTitle = ref<string>('')

let showTimerStopToast = ref<boolean>(false)
const completionModalRef = ref<HTMLDialogElement | null>(null)
const finalStats = ref({
  netWPM: 0,
  grossWPM: 0,
  accuracy: 0,
  typedChars: 0,
  correctChars: 0,
  incorrectChars: 0,
  totalTime: 0,
})

const typingRoot = ref<HTMLElement | null>(null)

let typed_id = ref(0) // id of the last typed character
let totalKeypresses = ref<number>(0)
let last_typed_time = ref(Date.now())
let timer_running = ref(false)
let running_time = ref(0) // in seconds

let testOngoing = ref<boolean>(false)
let testIntervalId: ReturnType<typeof setInterval> | null = null
let timerIntervalId: ReturnType<typeof setInterval> | null = null

let emit = defineEmits([
  'current_running_time',
  'updateStats',
  'updateBookInfo',
  'fetchChapterTitles',
])
emit('current_running_time', running_time.value)

let stats = computed(() => {
  const minutes = running_time.value / 60
  const typedChars = totalKeypresses.value

  const incorrectChars = charMap.value.filter((c: TextChar) => c.done && !c.correct).length

  const grossNumerator = typedChars / 5
  const grossWPM = minutes > 0 ? grossNumerator / minutes : 0
  const netWPM = minutes > 0 ? (grossNumerator - incorrectChars) / minutes : 0

  const correctChars = charMap.value.filter((c: TextChar) => c.done && c.correct).length
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

const fetchBook = async () => {
  try {
    loading.value = true

    const { data, error, status } = await supabase
      .from('books')
      .select('*')
      .eq('id', props.id)
      .single()

    if (error && status !== 406) throw error
    if (data) {
      foundBook.value = data
      getChapters()
    }
  } catch (error) {
    console.error('Error fetching books:', error)
  } finally {
    loading.value = false
  }
}

const getChapters = async () => {
  try {
    if (foundBook.value) {
      bookContent.value = await getEpubChapters(foundBook.value.path)

      chapterTitles.value = bookContent.value.map((chapter, idx) => {
        return chapter.title?.replace(/\s+/g, ' ').trim() || `Chapter ${idx + 1}`
      })

      chapterTitle.value = chapterTitles.value[props.chapIdx] || foundBook.value.title

      emit('updateBookInfo', foundBook.value.title, chapterTitles.value, props.chapIdx)

      initializeCharMap()
    }
  } catch (error) {
    console.error('Error fetching chapters:', error)
    alert('Error fetching chapters')
  }
}

const keydownHandler = (event: KeyboardEvent) => {
  if (event.defaultPrevented) {
    return // Do nothing if the event was already processed
  }
  event.preventDefault()

  if (!testOngoing.value) {
    testOngoing.value = true
  }

  const current_char = charMap.value.find((x: TextChar) => x.id === typed_id.value)
  if (!current_char) {
    return
  }

  if (event.key === 'Backspace') {
    if (typed_id.value === 0) return
    typed_id.value--
    const previousChar = charMap.value.find((x: TextChar) => x.id === typed_id.value)
    if (!previousChar) return
    previousChar.done = false
    previousChar.correct = false

    if (previousChar.char == '\n') previousChar.displayChar = '↵\n\n'
    else previousChar.displayChar = previousChar.char

    return
  }

  if (event.key === ' ') {
    totalKeypresses.value++
    current_char.done = true

    if (current_char.char === ' ') {
      current_char.correct = true
      current_char.displayChar = ' '
    } else {
      current_char.correct = false
      current_char.displayChar = '_'
    }

    typed_id.value++
    return
  }

  if (event.key === 'Enter') {
    totalKeypresses.value++
    current_char.done = true
    if (current_char.char === '\n') {
      current_char.correct = true
    } else {
      current_char.correct = false
    }
    typed_id.value++
    return
  }

  if (event.key.length === 1) {
    totalKeypresses.value++
    current_char.done = true

    if (event.key === current_char.char) {
      current_char.correct = true
    } else {
      current_char.correct = false
    }
    typed_id.value++
  }
}

const handleClick = () => {
  typingRoot.value?.focus()
}

onMounted(() => {
  fetchBook()
  window.addEventListener('keydown', keydownHandler, true)
})

function initializeCharMap() {
  const text = bookContent.value.at(props.chapIdx)?.content
  if (!text) {
    charMap.value = []
    console.error('No text content found')
    return
  }

  const characters = text
    .split('')

    .filter((char) => char !== '\t') // remove tabs

    .map((char) => {
      // Normalize different spaces
      if (char === '\u00A0') return ' ' // no break space
      if (/[\u2000-\u200B]/.test(char)) return ' ' // em space, en space, thin space, etc

      // normalize quotes (smart / curly quotes to straight)
      if (char === '\u2018' || char === '\u2019') return "'"
      if (char === '\u201C' || char === '\u201D') return '"'

      // normalize dashes
      if (char === '-' || char === '–' || char === '—' || char === '―') return '-'
      return char
    })

    // remove invisible characters
    .filter((char) => !/[\u200B-\u200D\uFEFF]/.test(char))

    // remove consecutive newlines
    .filter((char, idx, arr) => {
      if (char === '\n' && (arr[idx - 1] === '\n' || idx == 0)) {
        return false
      } else return true
    })

    // Remove leading newlines
    .filter((char, idx) => !(char === '\n' && idx === 0))

    .slice(0, 200)
    .map((char, id) => {
      let textChar = {
        id,
        char,
        displayChar: char,
        done: false,
        correct: false,
      }
      if (char === '\n') {
        textChar.displayChar = '↵\n\n'
      }
      return textChar
    })

  charMap.value = characters
}

function startTimer() {
  if (timerIntervalId !== null) clearInterval(timerIntervalId)

  let start = Date.now()
  timer_running.value = true

  if (running_time.value > 0) {
    start = start - running_time.value * 1000 // continue from previous time (deducted 5s of inactivity)
  }

  timerIntervalId = setInterval(() => {
    // stop timer when no presses detected for 5 seconds
    if (Date.now() - last_typed_time.value > 5000) {
      // alert('Timer stopped')

      showTimerStopToast.value = true

      setTimeout(() => {
        showTimerStopToast.value = false
      }, 5000)

      clearInterval(timerIntervalId!)
      testOngoing.value = false
      running_time.value = Math.max(0, running_time.value - 5) // deduct 5s of inactivity + end of current second
      timer_running.value = false

      emit('current_running_time', running_time.value)
      return
    }

    if (charMap.value.length === typed_id.value) {
      finalStats.value = {
        netWPM: stats.value.netWPM,
        grossWPM: stats.value.grossWPM,
        accuracy: stats.value.accuracy,
        typedChars: stats.value.typedChars,
        correctChars: stats.value.correctChars,
        incorrectChars: stats.value.incorrectChars,
        totalTime: running_time.value,
      }

      clearInterval(timerIntervalId!)
      timer_running.value = false
      testOngoing.value = false

      let newIdx = props.chapIdx
      newIdx++

      emit('updateBookInfo', foundBook.value?.title, chapterTitles.value, newIdx)

      if (completionModalRef.value) completionModalRef.value.showModal()
      return
    }

    const delta = Date.now() - start
    running_time.value = Math.floor(delta / 1000)
    emit('current_running_time', running_time.value)
  }, 200)
}

function stopTimer() {
  if (timerIntervalId !== null) {
    clearInterval(timerIntervalId)
    timerIntervalId = null
  }
  timer_running.value = false
}

function resetTypingTest() {
  stopTimer()
  typed_id.value = 0
  totalKeypresses.value = 0
  running_time.value = 0
  last_typed_time.value = Date.now()
  if (charMap.value) {
    charMap.value.forEach((char: TextChar) => {
      char.done = false
      char.correct = false
      char.displayChar = char.char === '\n' ? '↵\n\n' : char.char
    })
  }
}

function focus() {
  typingRoot.value?.focus()
}

watch(typed_id, (newId) => {
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

  let containerPos = container.getBoundingClientRect()
  let textContentPos = textContent.getBoundingClientRect()
  let currentCharPos = currentCharSpan.getBoundingClientRect()

  const containerCenter = containerPos.top + containerPos.height / 2

  if (caret.value) {
    const viewportHeight = window.innerHeight

    // scroll when caret goes below 65% of viewport
    if (currentCharPos.top > viewportHeight * 0.65) {
      currentCharSpan.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }

    if (currentCharPos.top < window.innerHeight * 0.25) {
      currentCharSpan.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }

    caret.value.style.top = `${currentCharSpan.offsetTop - 5}px`

    caret.value.style.left = `${currentCharSpan.offsetLeft - 10}px`
  }
})

watch(testOngoing, (testOngoing) => {
  if (testOngoing) {
    testIntervalId = setInterval(() => emit('updateStats', stats.value), 1000)
  } else if (testIntervalId !== null && !testOngoing) {
    clearInterval(testIntervalId)
    testIntervalId = null
    nextTick(() => {
      typingRoot.value?.focus() // Refocus after reset
    })
  }
})

watch(
  () => props.chapIdx,
  async () => {
    testOngoing.value = false
    initializeCharMap()
    resetTypingTest()

    await nextTick()
    const firstChar = document.getElementById('char-0')
    if (firstChar && caret.value) {
      firstChar.scrollIntoView({ behavior: 'smooth', block: 'center' })
      caret.value.style.top = `${firstChar.offsetTop - 5}px`
      caret.value.style.left = `${firstChar.offsetLeft - 10}px`
    }
  },
)

defineExpose({ focus })

onUnmounted(() => {
  stopTimer()
  if (testIntervalId !== null) {
    clearInterval(testIntervalId)
  }
  window.removeEventListener('keydown', keydownHandler, true)
})
</script>

<template>
  <div>
    <span v-if="loading" class="loading mx-auto my-auto loading-xl loading-spinner"></span>
    <div
      ref="typingRoot"
      @click="handleClick"
      tabindex="0"
      class="h-full w-full cursor-text px-6 font-mono text-4xl/12 font-medium text-clip text-base-content/60 select-none focus:outline-hidden"
    >
      <div id="text-content" class="relative">
        <span
          v-if="!loading"
          class="absolute animate-pulse text-5xl font-semibold text-primary"
          ref="caret"
          >|</span
        >
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

    <div class="toast z-50" v-if="showTimerStopToast">
      <div class="alert alert-warning">
        <span>User inactive for 5s: Timer stopped.</span>
      </div>
    </div>
    <dialog ref="completionModalRef" class="modal">
      <div class="modal-box bg-base-200">
        <h3 class="text-lg font-bold">Test Completed!</h3>
        <div class="flex flex-col space-y-4 py-4">
          <div class="stats stats-vertical bg-base-100 shadow lg:stats-horizontal">
            <div class="stat">
              <div class="stat-title">Net WPM</div>
              <div class="stat-value">{{ finalStats.netWPM }}</div>
            </div>
            <div class="stat">
              <div class="stat-title">Accuracy</div>
              <div class="stat-value">{{ finalStats.accuracy }}%</div>
            </div>
            <div class="stat">
              <div class="stat-title">Total Time</div>
              <div class="stat-value">
                {{ Math.floor(finalStats.totalTime / 60) }}m {{ finalStats.totalTime % 60 }}s
              </div>
            </div>
          </div>

          <div class="divider"></div>

          <div class="flex flex-col items-center space-y-1 text-sm">
            <div>
              <p class="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  fill="var(--color-success)"
                  class="bi bi-check-circle-fill mr-2"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"
                  />
                </svg>
                <span class="mr-1 font-bold text-success">{{ finalStats.correctChars }}</span>
                correct characters
              </p>
              <p class="mb-4 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  fill="var(--color-error)"
                  class="bi bi-x-circle-fill mr-2"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"
                  />
                </svg>
                <span class="mr-1 font-semibold text-error">{{ finalStats.incorrectChars }}</span>
                incorrect characters
              </p>
              <p class="flex items-center">
                <span class="mr-1 font-semibold">{{ finalStats.typedChars }}</span> total typed
              </p>
            </div>
          </div>
        </div>

        <div class="modal-action">
          <form method="dialog">
            <button class="btn btn-primary">Close</button>
          </form>
        </div>
      </div>
    </dialog>
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
