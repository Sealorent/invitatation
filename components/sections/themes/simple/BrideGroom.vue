<template>
  <DefaultSection v-bind="props" />
</template>

<script setup lang="ts">
import DefaultSection from '~/components/sections/BrideGroom.vue'

interface CoupleProfile {
  name?: string
  photo?: string
  fatherName?: string
  motherName?: string
  instagram?: string
}

const props = defineProps<{
  invitation: {
    brideName: string
    groomName: string
  }
  brideProfile?: CoupleProfile | null
  groomProfile?: CoupleProfile | null
  freeTexts?: string[]
}>()
</script>
