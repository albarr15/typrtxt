<script setup lang="ts">
import { onMounted, ref } from 'vue'
import NavigationBar from './components/NavigationBar.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <div class="flex min-h-screen w-full flex-col items-center justify-between bg-base-300">
    <NavigationBar />
    <router-view />
    <Footer />
  </div>
</template>

<style scoped></style>
