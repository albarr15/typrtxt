<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { supabase } from '../lib/supabaseClient'

let filter_genres = ref<string[]>([])
let filter_authors = ref<string[]>([])
let filter_lengths = ref<string[]>([])
let filter_reading_ease = ref<string[]>([])

let emit = defineEmits(['filter_genres', 'filter_authors', 'filter_lengths', 'filter_reading_ease'])
emit('filter_genres', filter_genres.value)
emit('filter_authors', filter_authors.value)
emit('filter_lengths', filter_lengths.value)
emit('filter_reading_ease', filter_reading_ease.value)

let genresAvailable = ref<string[]>([])
let authorsAvailable = ref<string[]>([])
let lengthsAvailable = ref<string[]>([
  'Short (<80,000 words)',
  'Medium (< 120,000 words)',
  'Long (> 120,000 words)',
])
let readingEaseAvailable = ref<string[]>([
  'Very confusing',
  'Difficult',
  'Fairly difficult',
  'Standard',
  'Fairly easy',
  'Easy',
  'Very easy',
])

onMounted(async () => {
  const { data, error }: { data: string[] | null; error: any } = await supabase
    .from('books')
    .select('subject')

  genresAvailable.value =
    data
      ?.map((item) => item['subject'])
      .filter((value, index, self) => self.indexOf(value) === index) || []

  genresAvailable.value.sort((a, b) => a.localeCompare(b))

  console.log('Subject data:', genresAvailable.value)

  if (error) {
    console.error('Error fetching genres: ', error)
    return
  }
})

onMounted(async () => {
  const { data, error }: { data: string[] | null; error: any } = await supabase
    .from('books')
    .select('creator')

  authorsAvailable.value =
    data
      ?.map((item) => item['creator'])
      .filter((value, index, self) => self.indexOf(value) === index) || []

  authorsAvailable.value.sort((a, b) => a.localeCompare(b))

  console.log('Author data:', authorsAvailable.value)

  if (error) {
    console.error('Error fetching authors: ', error)
    return
  }
})

function addToGenres(genre: string) {
  const index = filter_genres.value.indexOf(genre)
  if (index === -1) {
    filter_genres.value.push(genre)
  } else {
    filter_genres.value.splice(index, 1)
  }
  emit('filter_genres', filter_genres.value)
}

function addToAuthors(author: string) {
  const index = filter_authors.value.indexOf(author)
  if (index === -1) {
    filter_authors.value.push(author)
  } else {
    filter_authors.value.splice(index, 1)
  }
  emit('filter_authors', filter_authors.value)
}

function addToLengths(length: string) {
  const index = filter_lengths.value.indexOf(length)
  if (index === -1) {
    filter_lengths.value.push(length)
  } else {
    filter_lengths.value.splice(index, 1)
  }
  emit('filter_lengths', filter_lengths.value)
}

function addToReadingEase(ease: string) {
  const index = filter_reading_ease.value.indexOf(ease)
  if (index === -1) {
    filter_reading_ease.value.push(ease)
  } else {
    filter_reading_ease.value.splice(index, 1)
  }
  emit('filter_reading_ease', filter_reading_ease.value)
}
</script>

<template>
  <button class="btn shrink-0" onclick="filter_modal.showModal()">Filter</button>
  <dialog id="filter_modal" class="modal">
    <div class="modal-box max-h-3/4 bg-base-200">
      <h3 class="pb-4 text-lg font-bold">Filter Search</h3>

      <div class="collapse-plus collapse border border-base-300 bg-base-100">
        <input type="radio" name="my-accordion-3" checked="checked" />
        <div class="collapse-title font-semibold">Genre</div>
        <div class="collapse-content flex flex-col gap-2 text-sm">
          <label class="label" v-for="g in genresAvailable">
            <input type="checkbox" class="checkbox" @click="addToGenres(g)" />
            {{ g }}
          </label>
        </div>
      </div>
      <div class="collapse-plus collapse border border-base-300 bg-base-100">
        <input type="radio" name="my-accordion-3" />
        <div class="collapse-title font-semibold">Author</div>
        <div class="collapse-content flex flex-col gap-2 text-sm">
          <label class="label" v-for="a in authorsAvailable">
            <input type="checkbox" class="checkbox" @click="addToAuthors(a)" />
            {{ a }}
          </label>
        </div>
      </div>
      <div class="collapse-plus collapse border border-base-300 bg-base-100">
        <input type="radio" name="my-accordion-3" />
        <div class="collapse-title font-semibold">Length</div>
        <div class="collapse-content flex flex-col gap-2 text-sm">
          <label class="label" v-for="l in lengthsAvailable">
            <input type="checkbox" class="checkbox" @click="addToLengths(l)" />
            {{ l }}
          </label>
        </div>
      </div>
      <div class="collapse-plus collapse border border-base-300 bg-base-100">
        <input type="radio" name="my-accordion-3" />
        <div class="collapse-title font-semibold">Reading Ease</div>
        <div class="collapse-content flex flex-col gap-2 text-sm">
          <label class="label" v-for="re in readingEaseAvailable">
            <input type="checkbox" class="checkbox" @click="addToReadingEase(re)" />
            {{ re }}
          </label>
        </div>
      </div>

      <!-- <p class="py-4">Press ESC key or click the button below to close</p> -->
      <div class="modal-action">
        <form method="dialog">
          <button class="btn mr-2">Clear Filters</button>
          <button class="btn btn-primary">Filter</button>
        </form>
      </div>
    </div>
  </dialog>
</template>

<style scoped></style>
