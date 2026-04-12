<template>
  <ForwardSection v-bind="props" />
</template>

<script setup lang="ts">
import DefaultSection from '~/components/sections/Gift.vue'

interface BankAccount { id: string; bankName: string; accountNumber: string; accountHolder: string; qrCode?: string }

const ForwardSection = DefaultSection as any
const props = defineProps<{ bankAccounts: BankAccount[] }>()
</script>
