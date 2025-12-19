<script setup lang="ts">
import { ref } from 'vue'

const unit = ref(50)

const keyChar = defineProps({
  char: String,
  size: {
    type: Number,
    default: 1,
  },
  char2: String,
})
</script>

<template>
  <div
    class="flex flex-col items-center rounded-sm bg-base-100 p-1 pl-0.5 text-xs"
    :style="`width: ${keyChar.size * unit}px; height: ${unit - 10}px;`"
  >
    <span class="font-thin">{{ keyChar.char2 }}</span>
    <span>{{ keyChar.char }}</span>
  </div>
</template>

<style scoped></style>
