<script setup lang="ts">
import Footer from './components/Footer.vue'
import Keyboard from './components/Keyboard.vue'
import NavigationBar from './components/NavigationBar.vue'
</script>

<template>
  <div class="flex size-full flex-col items-center">
    <NavigationBar />
    <div
      class="my-auto flex h-fit max-h-4/5 min-h-200 w-4/5 max-w-7xl flex-col items-center justify-center gap-4"
    >
      <!-- main content -->
      <div class="-mt-15 flex h-4/5 flex-col rounded-xl bg-base-200 px-6 shadow-md">
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

        <div class="overflow-hidden px-6 text-4xl/12 font-medium text-clip text-base-content/60">
          <span class="text-primary">And now here is my secret, a</span>
          very simple secret: It is only with the heart that one can see rightly; what is essential
          is invisible to the eye.
        </div>
      </div>
      <!-- keyboard ui -->
      <Keyboard />
    </div>

    <Footer />
  </div>
</template>

<style scoped></style>
