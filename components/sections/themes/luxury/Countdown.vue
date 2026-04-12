<template>
  <div class="luxury-countdown-section py-16 md:py-24 text-center">
    <div class="max-w-4xl mx-auto px-6" data-aos="fade-up">
      <!-- Section Header -->
      <div class="text-center mb-12">
        <p class="font-display text-lg tracking-[0.2em] uppercase text-amber-400/80 mb-2">
          Counting Down
        </p>
        <h2 class="font-serif text-4xl md:text-5xl text-white mb-4">
          To The Big Day
        </h2>
        <div class="w-24 h-px bg-amber-500/50 mx-auto" />
      </div>

      <!-- Countdown Timer -->
      <div class="grid grid-cols-4 gap-2 md:gap-6 max-w-2xl mx-auto mb-12">
        <div v-for="unit in countdown" :key="unit.label" class="countdown-unit">
          <div class="value">{{ unit.value }}</div>
          <div class="label">{{ unit.label }}</div>
        </div>
      </div>

      <!-- Save to Calendar Button -->
      <button @click="saveToCalendar" class="btn-calendar">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        Save the Date
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import AOS from 'aos'

const props = defineProps<{
  invitation: {
    weddingDate: string
    brideName: string
    groomName: string
  }
}>()

const countdown = ref([
  { label: 'Days', value: 0 },
  { label: 'Hours', value: 0 },
  { label: 'Minutes', value: 0 },
  { label: 'Seconds', value: 0 }
])

let intervalId: ReturnType<typeof setInterval>

function updateCountdown() {
  const targetDate = new Date(props.invitation.weddingDate).getTime()
  const now = new Date().getTime()
  const distance = targetDate - now

  if (distance < 0) {
    countdown.value = [
      { label: 'Days', value: 0 },
      { label: 'Hours', value: 0 },
      { label: 'Minutes', value: 0 },
      { label: 'Seconds', value: 0 }
    ]
    if (intervalId) clearInterval(intervalId)
    return
  }

  countdown.value = [
    { label: 'Days', value: Math.floor(distance / (1000 * 60 * 60 * 24)) },
    { label: 'Hours', value: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) },
    { label: 'Minutes', value: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)) },
    { label: 'Seconds', value: Math.floor((distance % (1000 * 60)) / 1000) }
  ]
}

function saveToCalendar() {
  const date = new Date(props.invitation.weddingDate)
  const startTime = date.toISOString().replace(/-|:|\.\d\d\d/g, '')
  const endTime = new Date(date.getTime() + 2 * 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, '') // Add 2 hours duration

  const event = {
    title: `Wedding: ${props.invitation.brideName} & ${props.invitation.groomName}`,
    details: `Wedding of ${props.invitation.brideName} and ${props.invitation.groomName}`,
    location: 'To be confirmed',
    startTime,
    endTime
  }

  console.log('event', {
    title: event.title,
    details: event.details,
    location: event.location,
    startTime: event.startTime,
    endTime: event.endTime,
    brideName: props.invitation.brideName,
    groomName: props.invitation.groomName
  })
  const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.startTime}/${event.endTime}&details=${encodeURIComponent(event.details)}&location=${encodeURIComponent(event.location)}`
  
  window.open(googleCalendarUrl, '_blank')
}

onMounted(() => {
  updateCountdown()
  intervalId = setInterval(updateCountdown, 1000)
  if (process.client) {
    AOS.init({ duration: 800, once: true })
  }
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})
</script>

<style scoped lang="postcss">
.luxury-countdown-section {
  background:
    radial-gradient(circle at 10% 15%, rgba(193, 149, 65, 0.1), transparent 30%),
    radial-gradient(circle at 90% 85%, rgba(193, 149, 65, 0.08), transparent 40%),
    #1a1a1a;
}

.countdown-unit {
  @apply bg-black/20 border border-amber-800/50 rounded-2xl p-4 md:p-6 shadow-lg backdrop-blur-sm;
}

.countdown-unit .value {
  @apply font-serif text-4xl md:text-6xl text-white mb-1;
}

.countdown-unit .label {
  @apply text-xs md:text-sm text-amber-400/70 uppercase tracking-widest;
}

.btn-calendar {
  @apply inline-flex items-center justify-center bg-transparent border border-amber-700 text-amber-300 font-semibold py-3 px-8 rounded-lg transition hover:bg-amber-800/20 hover:text-white;
}
</style>

