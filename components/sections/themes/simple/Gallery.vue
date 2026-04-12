<template>
  <DefaultSection v-bind="props" />
</template>

<script setup lang="ts">
import DefaultSection from '~/components/sections/Gallery.vue'

interface GalleryItem { id: string; type: string; url: string; caption?: string }

const props = defineProps<{ gallery: GalleryItem[] }>()
</script>
