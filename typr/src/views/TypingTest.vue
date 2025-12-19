<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'

import ePub from 'epubjs'

import Keyboard from '../components/Keyboard.vue'
import TextContent from '../components/TextContent.vue'

const props = defineProps({
  content: String,
  id: {
    type: String,
    required: true,
  },
})

console.log(props.id)

const extractedText = ref('')

onMounted(async () => {
  console.log('Processing book ...')
  try {
    const book = ePub('./books/frankenstein.epub')
    await book.ready

    console.log('Book loaded')

    extractedText.value = ''

    book.spine.each(async (section: any) => {
      try {
        const doc: Document = await section.load(book.load.bind(book))

        const paragraphs = doc.querySelectorAll('p')
        paragraphs.forEach((p) => {
          extractedText.value += p.textContent?.trim() + '\n\n'
        })
        console.log(section.href)

        section.unload()

        console.log(extractedText.value)
      } catch (err) {
        console.error('Error loading section:', section.href, err)
      }
    })
  } catch (err) {
    console.error('Error loading book:', err)
  }
})

const textContent = ref(
  'And now here is my secret, a very simple secret: It is only with the heart that one can see rightly; what is essential is' +
    ' invisible to the eye.',
)

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

var stats = ref()
var accuracy = ref(0)
var wpm = ref(0)

function updateStats(newStats: Object) {
  stats.value = newStats
  console.log(stats.value)

  accuracy.value = stats.value.accuracy
  wpm.value = stats.value.netWPM
}
</script>

<template>
  <div
    class="my-auto flex h-fit max-h-4/5 min-h-150 w-2/3 max-w-7xl flex-col items-center justify-center gap-4"
  >
    <!-- main content -->
    <div class="flex h-4/5 w-full flex-col rounded-xl bg-base-200 px-6 shadow-md">
      <!-- book info -->
      <div
        class="m-4 flex h-1/12 items-center justify-between rounded-xl p-2 text-xs text-base-content/70"
      >
        <div>{{ displayTime }}</div>
        <div class="flex flex-col items-center justify-center">
          <div>The Little Prince</div>
          <div class="font-bold">CHAPTER 21</div>
        </div>

        <div class="flex items-center justify-center gap-5">
          <div class="font-bold">{{ wpm }}</div>
          <div class="font-bold">{{ accuracy }}%</div>
        </div>
      </div>
      <!-- text content -->
      <TextContent
        :id="props.id"
        :content="textContent"
        @current_running_time="updateTimer"
        @updateStats="updateStats"
      />
    </div>
    <!-- keyboard ui -->
    <Keyboard />
  </div>
  <div id="area"></div>
</template>

<style scoped></style>
