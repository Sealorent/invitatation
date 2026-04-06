<template>
  <section ref="sectionRef" class="py-20 px-6 bg-rose-50 section-enter" :class="{ visible: isVisible }">
    <div class="max-w-3xl mx-auto text-center">
      <p class="font-script text-4xl text-rose-400 mb-2">The Big Day</p>
      <h2 class="font-serif text-3xl font-semibold text-rose-800 mb-2">Counting Down</h2>
      <div class="gold-divider" />
      <p class="text-gray-500 text-sm mt-4">{{ formattedDate }}</p>

      <div class="mt-12 flex items-center justify-center gap-6 md:gap-12 flex-wrap">
        <div v-for="unit in countdown" :key="unit.label" class="countdown-box">
          <div class="w-24 h-24 rounded-2xl bg-white shadow-lg border border-rose-100 flex flex-col items-center justify-center">
            <span class="countdown-number">{{ unit.value }}</span>
          </div>
          <span class="countdown-label mt-2">{{ unit.label }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  invitation: { weddingDate: string | Date }
}>()

const sectionRef = ref<HTMLElement>()
const isVisible = ref(false)
const now = ref(new Date())
let timer: ReturnType<typeof setInterval>

const weddingDate = computed(() => new Date(props.invitation.weddingDate))
const formattedDate = computed(() => weddingDate.value.toLocaleDateString('en-US', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
}))

const countdown = computed(() => {
  const diff = Math.max(0, weddingDate.value.getTime() - now.value.getTime())
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
  return [
    { label: 'Days', value: days },
    { label: 'Hours', value: hours },
    { label: 'Minutes', value: minutes },
    { label: 'Seconds', value: seconds },
  ]
})

onMounted(() => {
  timer = setInterval(() => { now.value = new Date() }, 1000)
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) { isVisible.value = true; observer.disconnect() }
  }, { threshold: 0.1 })
  if (sectionRef.value) observer.observe(sectionRef.value)
})

onUnmounted(() => clearInterval(timer))
</script>
