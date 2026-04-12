<template>
  <DefaultSection v-bind="props" />
</template>

<script setup lang="ts">
import DefaultSection from '~/components/sections/Closing.vue'

const props = defineProps<{
  invitation: { brideName: string; groomName: string; slug?: string }
  closingMessage?: string
  coupleName?: string
}>()
</script>
