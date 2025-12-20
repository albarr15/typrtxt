<script setup lang="ts">
const props = defineProps({
  chapterTitles: { type: Array as () => string[], required: true },
})

console.log('In chap modal chap titles are: ', props.chapterTitles)
</script>

<template>
  <dialog id="chaptermodal" class="modal">
    <div class="modal-box">
      <h3>Select Chapter</h3>
      <div class="flex flex-col items-center">
        <button
          v-for="(chapter, idx) in chapterTitles"
          :key="idx"
          class="btn py-4"
          @click="$emit('selectChapter', idx)"
        >
          {{ chapter }}
        </button>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>Close</button>
    </form>
  </dialog>
</template>

<style scoped></style>
