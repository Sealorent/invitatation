<template>
  <div class="luxury-gold-wrap bg-black text-white [&_.romantic-bg]:bg-transparent [&_.text-rose-800]:!text-zinc-100 [&_.text-rose-700]:!text-zinc-200 [&_.text-rose-600]:!text-zinc-300 [&_.text-rose-500]:!text-zinc-400 [&_.text-rose-400]:!text-zinc-400 [&_.text-rose-300]:!text-zinc-500 [&_.text-rose-200]:!text-zinc-600 [&_.border-rose-200]:!border-zinc-700 [&_.border-rose-100]:!border-zinc-800 [&_.bg-rose-50]:!bg-zinc-950/70 [&_.bg-rose-100]:!bg-zinc-900/80 [&_.btn-gold]:!bg-gradient-to-r [&_.btn-gold]:!from-amber-500 [&_.btn-gold]:!to-yellow-600 [&_.btn-gold]:!text-amber-50 [&_.gold-divider]:!bg-gradient-to-r [&_.gold-divider]:!from-zinc-400 [&_.gold-divider]:!to-zinc-600">
    <DefaultSection v-bind="$attrs" />
  </div>
</template>

<script setup lang="ts">
import DefaultSection from '~/components/sections/LiveStream.vue'

</script>
