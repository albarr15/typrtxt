<script setup lang="ts">
import Footer from './components/Footer.vue'
import Keyboard from './components/Keyboard.vue'
import NavigationBar from './components/NavigationBar.vue'
</script>

<template>
  <div class="flex size-full flex-col items-center">
    <NavigationBar />
    <div
      class="my-auto flex h-4/5 w-4/5 flex-col items-center justify-center gap-4 rounded-xl bg-amber-100"
    >
      <!-- main content -->
      <div class="flex h-4/5 w-full flex-col rounded-xl bg-amber-300">
        <!-- book info -->
        <div
          class="flex h-1/12 w-full items-center justify-between rounded-xl bg-amber-400 p-2 text-xs"
        >
          <div>Page # 1</div>
          <div class="flex flex-col items-center justify-center">
            <div>El Filibusterismo</div>
            <div class="font-bold">CHAPTER 2</div>
          </div>

          <div class="flex items-center justify-center gap-5">
            <div>WPM</div>
            <div>Timer</div>
          </div>
        </div>
        <!-- text content -->
        <button class="btn">Button</button>

        <div class="lin overflow-hidden text-4xl/12 font-medium text-clip">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Error rerum eum tenetur
          laboriosam aperiam modi nemo aspernatur molestiae iure, vel blanditiis culpa, laudantium
          perferendis necessitatibus corporis quod est enim veniam. Lorem ipsum dolor sit amet
          consectetur adipisicing elit. Error rerum eum tenetur laboriosam aperiam modi nemo
          aspernatur molestiae iure, vel blanditiis culpa, laudantium perferendis necessitatibus
        </div>
      </div>
      <!-- keyboard ui -->
      <Keyboard />
    </div>

    <Footer />
  </div>
</template>

<style scoped></style>
