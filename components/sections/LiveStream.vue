<template>
  <section ref="sectionRef" class="py-20 px-6 bg-rose-50 section-enter" :class="{ visible: isVisible }">
    <div class="max-w-xl mx-auto text-center mb-8">
      <p class="font-script text-4xl text-rose-400 mb-2">Live Stream</p>
      <h2 class="font-serif text-3xl font-semibold text-rose-800">Join Us Online</h2>
      <div class="gold-divider" />
    </div>
    <div class="max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-xl" style="aspect-ratio:16/9">
      <iframe :src="embedUrl" class="w-full h-full" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{ youtubeUrl: string }>()
const sectionRef = ref<HTMLElement>()
const isVisible = ref(false)

const embedUrl = computed(() => {
  const match = props.youtubeUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]+)/)
  return match ? `https://www.youtube.com/embed/${match[1]}` : props.youtubeUrl
})

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) { isVisible.value = true; observer.disconnect() }
  }, { threshold: 0.1 })
  if (sectionRef.value) observer.observe(sectionRef.value)
})
</script>
