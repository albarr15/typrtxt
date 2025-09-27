<script setup lang="ts">
import { onMounted } from 'vue'
</script>

<template>
  <div class="card card-side h-40 w-full bg-base-100 shadow-sm">
    <figure>
      <img
        src="https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp"
        alt="Movie"
      />
    </figure>
    <div class="card-body">
      <h2 class="card-title">Frankenstein</h2>
      <p>Click the button to watch on Jetflix app.</p>
      <div class="card-actions justify-end">
        <button class="btn btn-primary">Watch</button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
