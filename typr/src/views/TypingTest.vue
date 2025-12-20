<script setup lang="ts">
import { onMounted, watch, ref } from 'vue'

import Keyboard from '../components/Keyboard.vue'
import TextContent from '../components/TextContent.vue'
import { BookInfo } from '../types/book'
import ChapterModal from '../components/ChapterModal.vue'
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

var current_running_time = ref(0)
var displayTime = ref('00:00:00')

function updateTimer(newTime: number) {
  current_running_time.value = newTime

  let date = new Date(0)
  date.setSeconds(newTime)
  var timeString = date.toISOString().substring(11, 19)
  if (timeString[0] == '0' || timeString[1] == '0') {
    timeString = timeString.substring(3) // hide hours display
  }
  displayTime.value = timeString
}

function selectChapter(idx: number) {
  console.log('Changing chapterIndex to ', idx)

  bookChapterIdx.value = idx
  const modal = document.getElementById('chaptermodal') as HTMLDialogElement
  modal?.close()
}

var stats = ref()
var accuracy = ref(0)
var wpm = ref(0)
let bookChapterTitles = ref<string[]>([])
let bookChapterIdx = ref<number>(0)
let bookTitle = ref('Book Title')

function updateStats(newStats: Object) {
  stats.value = newStats
  // console.log(stats.value)

  accuracy.value = stats.value.accuracy
  wpm.value = stats.value.netWPM
}

function updateBookInfo(title: string, chapters: string[], chapterIdx: number) {
  bookTitle.value = title
  bookChapterTitles.value = chapters
  bookChapterIdx.value = chapterIdx
  // console.log(bookChapterIdx.value)
  console.log(bookChapterTitles.value)
}

// // Save to localStorage as backup
watch(
  stats,
  (newStats) => {
    localStorage.setItem(
      `typing-session-${props.id}`,
      JSON.stringify({
        stats: newStats,
        chapterIndex: bookChapterIdx.value,
      }),
    )
  },
  { deep: true },
)
</script>

<template>
  <div
    class="my-auto flex h-fit max-h-4/5 min-h-150 w-2/3 max-w-7xl flex-col items-center justify-center gap-4"
  >
    <div class="sticky top-24 z-10">
      <div
        class="flex items-center justify-between gap-4 rounded-xl bg-base-200 p-2 text-xs text-base-content/70 shadow-md"
      >
        <div>{{ displayTime }}</div>
        <div class="flex flex-col items-center justify-center">
          <div>{{ bookTitle }}</div>
          <div class="font-bold">{{ bookChapterTitles[bookChapterIdx] }}</div>
        </div>
        <div class="flex items-center justify-center gap-5">
          <div class="font-bold">{{ wpm }}</div>
          <div class="font-bold">{{ accuracy }}%</div>
        </div>
      </div>
    </div>
    <button
      class="hover:text-underline btn m-2 h-8 font-light opacity-30 btn-ghost hover:opacity-50"
      onclick="chaptermodal.showModal()"
    >
      Change Chapter?
    </button>
    <!-- main content -->
    <div class="flex h-4/5 w-full flex-col rounded-xl bg-base-200 px-6 py-4 shadow-md">
      <!-- book info -->
      <!-- <div
        class="sticky top-0 z-10 m-4 flex h-1/12 items-center justify-between rounded-xl p-2 text-xs text-base-content/70"
      >
        <div>{{ displayTime }}</div>
        <div class="flex flex-col items-center justify-center">
          <div>{{ bookTitle }}</div>
          <div class="font-bold">{{ bookChapter }}</div>
        </div>

        <div class="flex items-center justify-center gap-5">
          <div class="font-bold">{{ wpm }}</div>
          <div class="font-bold">{{ accuracy }}%</div>
        </div>
      </div> -->
      <!-- text content -->
      <TextContent
        :key="`${props.id}-${bookChapterIdx}`"
        :id="props.id"
        :chapIdx="bookChapterIdx"
        @current_running_time="updateTimer"
        @updateStats="updateStats"
        @updateBookInfo="updateBookInfo"
      />
    </div>
    <!-- keyboard ui -->
    <Keyboard />

    <dialog id="chaptermodal" class="modal">
      <div class="modal-box">
        <h3 class="text-lg font-bold">Select Chapter</h3>
        <div class="flex flex-col items-center">
          <button
            class="btn py-4"
            v-for="(chapter, idx) in bookChapterTitles"
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

    <!-- <ChapterModal :chapterTitles="bookChapterTitles" /> -->
  </div>
</template>

<style scoped></style>
