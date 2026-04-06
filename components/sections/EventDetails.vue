<template>
  <section ref="sectionRef" class="py-20 px-6 romantic-bg section-enter" :class="{ visible: isVisible }">
    <div class="max-w-4xl mx-auto text-center mb-12">
      <p class="font-script text-4xl text-rose-400 mb-2">Save the Date</p>
      <h2 class="font-serif text-3xl font-semibold text-rose-800">Event Details</h2>
      <div class="gold-divider" />
    </div>

    <div class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      <div
        v-for="event in events"
        :key="event.id"
        class="card-romantic p-8 text-center"
      >
        <!-- Event icon -->
        <div class="text-4xl mb-4">{{ event.type === 'akad' ? '🕌' : '🏛️' }}</div>
        <div class="gold-divider" />
        <h3 class="font-serif text-2xl font-semibold text-rose-800 mt-4 mb-2">{{ event.title }}</h3>
        <p class="text-gray-500 text-sm mb-4">{{ formatDate(event.date) }}</p>

        <div class="space-y-2 text-sm text-gray-600">
          <div class="flex items-center justify-center gap-2">
            <span>🕐</span><span>{{ event.time }}</span>
          </div>
          <div class="flex items-center justify-center gap-2">
            <span>🏛️</span><span class="font-medium">{{ event.venue }}</span>
          </div>
          <div class="flex items-start justify-center gap-2">
            <span>📍</span>
            <span class="text-left">{{ event.address }}</span>
          </div>
        </div>

        <a
          v-if="event.mapsLink"
          :href="event.mapsLink"
          target="_blank"
          class="btn-outline mt-6 inline-block text-sm"
        >
          📍 Open in Maps
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  events: Array<{
    id: string; title: string; date: string | Date; time: string;
    venue: string; address: string; mapsLink?: string; type: string
  }>
}>()

const sectionRef = ref<HTMLElement>()
const isVisible = ref(false)

function formatDate(date: string | Date) {
  return new Date(date as string).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })
}

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) { isVisible.value = true; observer.disconnect() }
  }, { threshold: 0.1 })
  if (sectionRef.value) observer.observe(sectionRef.value)
})
</script>
