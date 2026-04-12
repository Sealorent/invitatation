<template>
  <DefaultSection v-bind="props" />
</template>

<script setup lang="ts">
import DefaultSection from '~/components/sections/LiveStream.vue'

const props = defineProps<{ youtubeUrl: string }>()
</script>
