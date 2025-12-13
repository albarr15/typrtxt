<script setup lang="ts">
import { onMounted, ref } from 'vue'
import NavigationBar from './components/NavigationBar.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <div class="flex size-full flex-col items-center justify-between">
    <NavigationBar />
    <router-view />
    <Footer />
  </div>
</template>

<style scoped></style>
