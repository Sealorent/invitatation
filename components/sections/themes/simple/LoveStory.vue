<template>
  <!-- <DefaultSection v-bind="props" /> -->
   <div class="max-w-3xl mx-auto text-center mb-12">
      <p class="font-script text-4xl text-rose-400 mb-2">Our Journey</p>
      <h2 class="font-serif text-3xl font-semibold text-rose-800">Love Story</h2>
      <div class="gold-divider" />
    </div>
</template>

<script setup lang="ts">
import DefaultSection from '~/components/sections/LoveStory.vue'

const props = defineProps<{
  stories: Array<{ 
    id: string
    year?: string
    title: string
    subtitle?: string
    description?: string
    photo?: string
    photos?: string[]
  }>
}>()
</script>
