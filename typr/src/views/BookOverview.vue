<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabaseClient'
import { BookInfo } from '../types/book'
import { getEpubChapters } from '../../scripts/getEpubChapters'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

console.log(props.id)

const foundBook = ref<BookInfo | null>(null)
const loading = ref<boolean>(true)

const textContent = ref<string[]>([])

onMounted(() => {
  fetchBook()
})

const fetchBook = async () => {
  try {
    loading.value = true

    const { data, error, status } = await supabase
      .from('books')
      .select('*')
      .eq('id', props.id)
      .single()

    if (error && status !== 406) throw error
    if (data) {
      foundBook.value = data
      console.log('Fetched book:', foundBook.value)
      getChapters()
    }
  } catch (error) {
    console.error('Error fetching books:', error)
  } finally {
    loading.value = false
  }
}

const getChapters = async () => {
  try {
    if (foundBook.value) {
      console.log('Getting chapters for book id:', props.id)

      textContent.value = await getEpubChapters(foundBook.value.path)
      console.log('Fetched text content:', textContent.value)
    }
  } catch (error) {
    console.error('Error fetching chapters:', error)
    alert('Error fetching chapters')
  }
}
</script>

<template>
  <div class="flex w-[80dvw] flex-col items-center justify-start px-5">
    <h1 class="font-semibold">{{ foundBook?.title }}</h1>

    {{ foundBook?.creator }}

    chapter size:{{ textContent.length }}

    <ol>
      <p v-for="chapter in textContent" style="white-space: pre-wrap">{{ chapter }}</p>
      <br />
      <br />
    </ol>
  </div>
</template>

<style scoped></style>
