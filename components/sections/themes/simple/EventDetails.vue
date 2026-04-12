<template>
  <ForwardSection v-bind="props" />
</template>

<script setup lang="ts">
import DefaultSection from '~/components/sections/EventDetails.vue'

const ForwardSection = DefaultSection as any
const props = defineProps<{
  events: Array<{
    id: string; title: string; date: string | Date; time: string;
    venue: string; address: string; mapsLink?: string; type: string
  }>
}>()
</script>
