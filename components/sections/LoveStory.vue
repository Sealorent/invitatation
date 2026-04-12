<template>
  <section ref="sectionRef" class="py-20 px-6 bg-rose-50 section-enter" :class="{ visible: isVisible }">
    <div class="max-w-3xl mx-auto text-center mb-12">
      <p class="font-script text-4xl text-rose-400 mb-2">Our Journey</p>
      <h2 class="font-serif text-3xl font-semibold text-rose-800">Love Story</h2>
      <div class="gold-divider" />
    </div>

    <div class="max-w-3xl mx-auto timeline-container space-y-0">
      <div
        v-for="(story, index) in stories"
        :key="story.id"
        class="flex items-start gap-6 pb-12"
        :class="index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'"
      >
        <!-- Content card -->
        <div class="flex-1 card-romantic p-6">
          <!-- Multiple photos carousel/grid -->
          <div v-if="story.photos?.length" class="mb-4 rounded-xl overflow-hidden">
            <div v-if="story.photos.length === 1" class="w-full">
              <img :src="story.photos[0]" :alt="story.title" class="w-full h-40 object-cover rounded-lg" />
            </div>
            <div v-else class="grid grid-cols-2 gap-2">
              <img 
                v-for="(photo, idx) in story.photos.slice(0, 4)" 
                :key="idx"
                :src="photo" 
                :alt="`${story.title} photo ${idx + 1}`" 
                class="w-full h-24 object-cover rounded-lg"
              />
            </div>
          </div>
          
          <!-- Fallback to old photo field -->
          <div v-else-if="story.photo" class="mb-4 rounded-xl overflow-hidden">
            <img :src="story.photo" :alt="story.title" class="w-full h-40 object-cover" />
          </div>

          <span class="text-xs font-bold bg-rose-100 text-rose-600 px-3 py-1 rounded-full">{{ story.year }}</span>
          <h3 class="font-serif text-lg font-semibold text-rose-800 mt-2 mb-1">{{ story.title }}</h3>
          
          <!-- Display subtitle (rich text) or fall back to description -->
          <div v-if="story.subtitle" class="text-gray-600 text-sm leading-relaxed prose prose-sm max-w-none" v-html="story.subtitle" />
          <p v-else-if="story.description" class="text-gray-600 text-sm leading-relaxed">{{ story.description }}</p>
        </div>

        <!-- Timeline dot -->
        <div class="hidden md:flex flex-col items-center pt-4">
          <div class="w-12 h-12 rounded-full bg-rose-400 flex items-center justify-center text-white text-xl shadow-lg">
            💕
          </div>
          <div class="w-0.5 flex-1 bg-rose-200 mt-2" />
        </div>

        <!-- Spacer for alternating -->
        <div class="flex-1 hidden md:block" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  stories: Array<{ 
    id: string
    year?: string
    title: string
    subtitle?: string
    description?: string
    photo?: string
    photos?: string[]
  }>
}>()

const sectionRef = ref<HTMLElement>()
const isVisible = ref(false)

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) { isVisible.value = true; observer.disconnect() }
  }, { threshold: 0.1 })
  if (sectionRef.value) observer.observe(sectionRef.value)
})
</script>
