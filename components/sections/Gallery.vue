<template>
  <section ref="sectionRef" class="py-20 px-6 romantic-bg section-enter" :class="{ visible: isVisible }">
    <div class="max-w-5xl mx-auto text-center mb-12">
      <p class="font-script text-4xl text-rose-400 mb-2">Our Memories</p>
      <h2 class="font-serif text-3xl font-semibold text-rose-800">Gallery</h2>
      <div class="gold-divider" />
    </div>

    <div class="max-w-5xl mx-auto">
      <div v-if="gallery.length === 0" class="text-center text-gray-400 py-12 text-sm">No gallery items yet</div>

      <!-- Masonry grid for images, grid for videos -->
      <div class="gallery-masonry">
        <div v-for="item in gallery" :key="item.id" class="mb-4 break-inside-avoid">
          <!-- YouTube embed -->
          <div v-if="item.type === 'youtube'" class="relative rounded-xl overflow-hidden shadow-lg" style="aspect-ratio:16/9">
            <iframe
              :src="getYoutubeEmbed(item.url)"
              class="w-full h-full"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            />
          </div>

          <!-- Video -->
          <video
            v-else-if="item.type === 'video'"
            :src="item.url"
            class="w-full rounded-xl shadow-lg"
            controls
          />

          <!-- Image -->
          <img
            v-else
            :src="item.url"
            :alt="item.caption || 'Gallery'"
            class="w-full rounded-xl shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300"
            @click="lightbox = item"
          />

          <p v-if="item.caption" class="text-xs text-gray-500 text-center mt-1">{{ item.caption }}</p>
        </div>
      </div>
    </div>

    <!-- Lightbox -->
    <div
      v-if="lightbox"
      class="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
      @click="lightbox = null"
    >
      <img :src="lightbox.url" :alt="lightbox.caption" class="max-w-full max-h-screen object-contain rounded-xl" />
      <button class="absolute top-4 right-4 text-white text-3xl" @click="lightbox = null">✕</button>
    </div>
  </section>
</template>

<script setup lang="ts">
interface GalleryItem { id: string; type: string; url: string; caption?: string }
defineProps<{ gallery: GalleryItem[] }>()

const sectionRef = ref<HTMLElement>()
const isVisible = ref(false)
const lightbox = ref<GalleryItem | null>(null)

function getYoutubeEmbed(url: string) {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]+)/)
  return match ? `https://www.youtube.com/embed/${match[1]}` : url
}

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) { isVisible.value = true; observer.disconnect() }
  }, { threshold: 0.05 })
  if (sectionRef.value) observer.observe(sectionRef.value)
})
</script>
