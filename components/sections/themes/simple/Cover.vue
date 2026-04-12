<template>
  <DefaultSection v-bind="props" />
</template>

<script setup lang="ts">
import DefaultSection from '~/components/sections/Cover.vue'

const props = defineProps<{
  invitation: {
    brideName: string
    groomName: string
    weddingDate: string | Date
    coverPhoto?: string | null
  }
  guestName?: string
  onOpen?: () => void
}>()
</script>
