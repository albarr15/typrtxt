<script setup lang="ts">
import { defineProps, ref } from 'vue'

const unit = ref(35)

const keyChar = defineProps({
  char: String,
  size: {
    type: Number,
    default: 1,
  },
})
</script>

<template>
  <div
    class="flex items-center rounded-xs bg-base-100 p-1 text-[10px]"
    :style="`width: ${keyChar.size * unit}px; height: ${unit - 10}px;`"
  >
    {{ keyChar.char }}
  </div>
</template>

<style scoped></style>
