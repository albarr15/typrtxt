<script setup lang="ts">
import NavigationBar from './components/NavigationBar.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <div class="flex min-h-screen w-full flex-col items-center bg-base-300">
    <NavigationBar />
    <router-view class="main" />
    <Footer />
  </div>
</template>

<style scoped>
.main {
  flex: 1;
}
</style>
