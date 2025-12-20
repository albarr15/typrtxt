<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed } from 'vue'
import { supabase } from '../lib/supabaseClient'
import { BookInfo } from '../types/book'
import { getEpubChapters } from '../../scripts/getEpubChapters'
import { Chapter } from '../../scripts/getEpubChapters'

const props = defineProps({
  id: {
    type: String,
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

// console.log(props.id)

const foundBook = ref<BookInfo | null>(null)
const loading = ref<boolean>(true)

const textContent1 = ref<Chapter[]>([])
const chapterTitles = ref<string[]>([])
const charMap = ref<TextChar[]>([])
const chapterIndex = ref<number>(0)
const chapterTitle = ref<string>('')

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
      // console.log('Fetched book:', foundBook.value)
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
      // console.log('Getting chapters for book id:', props.id)

      textContent1.value = await getEpubChapters(foundBook.value.path)
      console.log(textContent1.value)

      chapterTitles.value = textContent1.value.map((chapter) => chapter.title)

      const savedSession = localStorage.getItem(`typing-session-${props.id}`)
      let initialChapterIdx = foundBook.value.current_chapter_idx ?? 0

      if (savedSession) {
        try {
          const { chapterIndex: savedChapterIndex } = JSON.parse(savedSession)
          if (confirm('Continue previous session?')) {
            initialChapterIdx = savedChapterIndex
          } else {
            // User declined, clear localStorage
            localStorage.removeItem(`typing-session-${props.id}`)
          }
        } catch (e) {
          console.error('Failed to restore session:', e)
        }
      }

      // Now set the chapter index (either from localStorage or database)
      chapterIndex.value = initialChapterIdx

      const foundCurrentChapterTitle =
        chapterTitles.value[chapterIndex.value] || foundBook.value.title
      chapterTitle.value = foundCurrentChapterTitle

      emit('updateBookInfo', foundBook.value.title, chapterTitle.value)

      initializeCharMap()
    }
  } catch (error) {
    console.error('Error fetching chapters:', error)
    alert('Error fetching chapters')
  }
}

let typed_id = ref(0) // id of the last typed character
let totalKeypresses = ref<number>(0)
let last_typed_time = ref(Date.now())
let timer_running = ref(false)
let running_time = ref(0) // in seconds

let emit = defineEmits(['current_running_time', 'updateStats', 'updateBookInfo'])
emit('current_running_time', running_time.value)

function initializeCharMap() {
  const text = textContent1.value.at(chapterIndex.value)?.content
  if (!text) {
    charMap.value = []
    console.error('No text content found')
    return
  }

  const characters = text
    .split('')
    .filter((char) => char !== '\t') // remove tabs
    .filter((char, idx, arr) => {
      if (char === '\n' && (arr[idx - 1] === '\n' || idx == 0)) {
        return false // remove consecutive newlines
      } else return true
    })
    .slice(0, 50) //TEMP: limit first 300 characters
    .map((char, id) => {
      let textChar = {
        id,
        char,
        displayChar: char,
        done: false,
        correct: false,
      }
      if (char === '\n') {
        textChar.displayChar = '\n\n'
      }
      return textChar
    })

  charMap.value = characters

  // console.log('Char map:', charMap.value)
}

let stats = computed(() => {
  const minutes = running_time.value / 60
  // const typedChars = charMap.value.filter((c: TextChar) => c.done).length
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
let testOngoing = ref<boolean>(false)
let testIntervalId: ReturnType<typeof setInterval> | null = null

watch(chapterIndex, () => {
  if (!foundBook.value) return

  chapterTitle.value = chapterTitles.value[chapterIndex.value] || foundBook.value.title
  foundBook.value.current_chapter_idx = chapterIndex.value
  foundBook.value.current_chapter_title = chapterTitle.value

  console.log('UPDATED CHAP TITLE: ', chapterTitle.value)
  emit('updateBookInfo', foundBook.value.title, chapterTitle.value)

  initializeCharMap()
})

watch(testOngoing, (testOngoing) => {
  if (testOngoing) {
    testIntervalId = setInterval(() => emit('updateStats', stats.value), 1000)
  } else if (testIntervalId !== null && !testOngoing) {
    clearInterval(testIntervalId)
    testIntervalId = null
    resetTypingTest()
  }
})

onMounted(() => {
  fetchBook()
})

window.addEventListener('keydown', (event) => {
  if (event.defaultPrevented) {
    return // Do nothing if the event was already processed
  }
  event.preventDefault()

  if (!testOngoing.value) {
    testOngoing.value = true
  }

  const current_char = charMap.value.find((x: TextChar) => x.id === typed_id.value)
  if (!current_char) return

  if (event.key === 'Backspace') {
    if (typed_id.value === 0) return
    typed_id.value--
    const previousChar = charMap.value.find((x: TextChar) => x.id === typed_id.value)
    if (!previousChar) return
    previousChar.done = false
    previousChar.correct = false

    if (previousChar.char == '\n') previousChar.displayChar = '\n\n'
    else previousChar.displayChar = previousChar.char

    return
  }

  if (event.key === ' ') {
    totalKeypresses.value++
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
    totalKeypresses.value++
    current_char.done = true
  }

  if (event.key === 'Enter') {
    typed_id.value++
    totalKeypresses.value++
    current_char.done = true
    if (current_char.char === '\n') {
      current_char.correct = true
    } else {
      current_char.correct = false
    }
    return
  }

  if (event.key === current_char.char) {
    current_char.correct = true
  } else {
    current_char.correct = false
  }
})

let timerIntervalId: ReturnType<typeof setInterval> | null = null

function startTimer() {
  if (timerIntervalId !== null) clearInterval(timerIntervalId)

  let start = Date.now()
  timer_running.value = true
  console.log('Timer started')

  if (running_time.value > 0) {
    start = start - running_time.value * 1000 // continue from previous time (deducted 5s of inactivity)
  }

  timerIntervalId = setInterval(() => {
    // stop timer when no presses detected for 5 seconds
    if (Date.now() - last_typed_time.value > 5000) {
      alert('Timer stopped')
      clearInterval(timerIntervalId!)

      running_time.value = Math.max(0, running_time.value - 5) // deduct 5s of inactivity + end of current second
      timer_running.value = false

      emit('current_running_time', running_time.value)
      return
    }

    if (charMap.value.length === typed_id.value) {
      alert('Test completed! Press Enter to continue to next chapter.')
      clearInterval(timerIntervalId!)
      timer_running.value = false
      testOngoing.value = false
      chapterIndex.value++
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

onUnmounted(() => {
  stopTimer()
  if (testIntervalId !== null) {
    clearInterval(testIntervalId)
  }
})

function resetTypingTest() {
  typed_id.value = 0
  totalKeypresses.value = 0
  running_time.value = 0
  last_typed_time.value = Date.now()
  if (charMap.value) {
    charMap.value.forEach((char: TextChar) => {
      char.done = false
      char.correct = false
      char.displayChar = char.char === '\n' ? '\n\n' : char.char
    })
  }
}

function selectChapter(idx: number) {
  chapterIndex.value = idx
  const modal = document.getElementById('chaptermodal') as HTMLDialogElement
  modal?.close()
}

// Save to localStorage as backup
watch(
  stats,
  (newStats) => {
    if (!charMap.value || charMap.value.length === 0) return

    localStorage.setItem(
      `typing-session-${props.id}`,
      JSON.stringify({
        stats: newStats,
        chapterIndex: chapterIndex.value,
      }),
    )
  },
  { deep: true },
)
</script>

<template>
  <div>
    <span v-if="loading" class="loading mx-auto my-auto loading-xl loading-spinner"></span>

    <button class="btn" onclick="chaptermodal.showModal()">open modal</button>
    <dialog id="chaptermodal" class="modal">
      <div class="modal-box">
        <h3 class="text-lg font-bold">Select Chapter</h3>
        <div class="flex flex-col items-center">
          <button
            class="btn py-4"
            v-for="(chapter, idx) in chapterTitles"
            :key="idx"
            @click="selectChapter(idx)"
          >
            {{ chapter }}
          </button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
    <div
      tabindex="0"
      class="h-full w-full cursor-text overflow-y-auto px-6 font-mono text-4xl/12 font-medium text-clip text-base-content/60 select-none focus:outline-hidden"
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
