<template>
  <DefaultSection v-bind="props" />
</template>

<script setup lang="ts">
import DefaultSection from '~/components/sections/Countdown.vue'

const props = defineProps<{
  invitation: { weddingDate: string | Date }
}>()
</script>
