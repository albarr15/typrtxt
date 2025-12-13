<script setup lang="ts">
import { Icon } from '@iconify/vue'
</script>

<template>
  <footer
    class="mt-4 footer footer-horizontal items-center justify-between bg-neutral p-4 text-neutral-content"
  >
    <aside class="grid-flow-col items-center">
      <p>Made with 🩶 by albarr15</p>
    </aside>
    <nav class="grid-flow-col gap-4 lg:gap-8">
      <a class="text-current" :href="'https://www.linkedin.com/in/clarissa-albarracin-0a2b882aa/'">
        <Icon icon="mdi:linkedin" :height="24" />
      </a>
      <a class="text-current" :href="'mailto:' + 'clarissa.albarracin@gmail.com'">
        <Icon icon="mdi:email" :height="24" />
      </a>
      <a class="text-current" :href="'https://github.com/albarr15'">
        <Icon icon="mdi:github" :height="24" />
      </a>
    </nav>
  </footer>
</template>

<style scoped></style>
