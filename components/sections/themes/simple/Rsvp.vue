<template>
  <DefaultSection v-bind="props" />
</template>

<script setup lang="ts">
import DefaultSection from '~/components/sections/Rsvp.vue'

const props = defineProps<{ invitationId: string }>()
</script>
