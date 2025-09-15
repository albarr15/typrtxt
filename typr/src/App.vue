<script setup lang="ts">
import { ref } from 'vue'

import Footer from './components/Footer.vue'
import Keyboard from './components/Keyboard.vue'
import NavigationBar from './components/NavigationBar.vue'
import TextContent from './components/TextContent.vue'

const textContent = ref(
  'And now here is my secret, a very simple secret: It is only with the heart that one can see rightly; what is essential is' +
    ' invisible to the eye.',
)
</script>

<template>
  <div class="flex size-full flex-col items-center">
    <NavigationBar />
    <div
      class="my-auto flex h-fit max-h-4/5 min-h-150 w-2/3 max-w-7xl flex-col items-center justify-center gap-4"
    >
      <!-- main content -->
      <div class="flex h-4/5 flex-col rounded-xl bg-base-200 px-6 shadow-md">
        <!-- book info -->
        <div
          class="m-4 flex h-1/12 items-center justify-between rounded-xl p-2 text-xs text-base-content/70"
        >
          <div>Progress:</div>
          <div class="flex flex-col items-center justify-center">
            <div>The Little Prince</div>
            <div class="font-bold">CHAPTER 21</div>
          </div>

          <div class="flex items-center justify-center gap-5">
            <div class="font-bold">WPM</div>
            <div class="font-bold">Timer</div>
          </div>
        </div>
        <!-- text content -->
        <TextContent :content="textContent" />
      </div>
      <!-- keyboard ui -->
      <Keyboard />
    </div>

    <Footer />
  </div>
</template>

<style scoped></style>
