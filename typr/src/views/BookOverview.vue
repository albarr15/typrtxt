<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabaseClient'
import { BookInfo } from '../types/book'

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
})

console.log(props.id)

const foundBook = ref<BookInfo | null>(null)
const loading = ref<boolean>(true)

onMounted(() => fetchBook())

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
    }
  } catch (error) {
    console.error('Error fetching books:', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex w-[80dvw] flex-col items-center justify-start px-5">
    <h1 class="font-semibold">{{ foundBook?.title }}</h1>

    {{ foundBook?.creator }}
  </div>
</template>

<style scoped></style>
