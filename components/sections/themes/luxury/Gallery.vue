<template>
  <section ref="sectionRef" class="luxury-gallery section-enter py-20 px-6" :class="{ visible: isVisible }">
    <div class="max-w-5xl mx-auto text-center mb-12">
      <p class="font-script text-4xl text-zinc-300 mb-2">Our Memories</p>
      <h2 class="font-serif text-3xl font-semibold text-zinc-100">Gallery</h2>
      <div class="gold-divider mx-auto" />
    </div>

    <div v-if="freeTexts.length" class="max-w-5xl mx-auto mb-8 space-y-2 flex flex-col items-center">
      <div
        v-for="(freeText, textIdx) in freeTexts"
        :key="`luxury-gallery-free-text-${textIdx}`"
        class="w-fit max-w-full bg-white px-[1px] text-center text-sm leading-relaxed text-zinc-800"
        v-html="freeText"
      />
    </div>

    <div class="max-w-5xl mx-auto">
      <div v-if="gallery.length === 0" class="text-center text-zinc-500 py-12 text-sm">No gallery items yet</div>

      <div
        v-if="featuredVideo"
        class="mb-4 rounded-2xl overflow-hidden shadow-xl border-2 border-amber-600/60"
        data-aos="fade-in"
      >
        <div v-if="featuredVideo.type === 'youtube'" class="relative w-full aspect-video">
          <iframe
            :src="getYoutubeEmbed(featuredVideo.url)"
            class="w-full h-full"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          />
        </div>
        <video
          v-else
          :src="featuredVideo.url"
          class="w-full aspect-video object-cover"
          controls
        />
      </div>

      <div v-if="photoItems.length" class="grid grid-cols-3 gap-2 sm:gap-3">
        <div
          v-for="item in photoItems"
          :key="item.id"
          class="overflow-hidden rounded-xl border-2 border-amber-700/50 hover:border-amber-500 transition-colors"
          data-aos="fade-in"
        >
          <img
            :src="item.url"
            :alt="item.caption || 'Gallery'"
            class="w-full aspect-[3/4] object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
            @click="lightbox = item"
          />
        </div>
      </div>
    </div>

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
interface GalleryItem {
  id: string
  type: string
  url: string
  caption?: string
}

const props = defineProps<{
  gallery: GalleryItem[]
  freeTexts?: string[]
}>()

const sectionRef = ref<HTMLElement>()
const isVisible = ref(false)
const lightbox = ref<GalleryItem | null>(null)

const freeTexts = computed(() => props.freeTexts || [])

const featuredVideo = computed(() => props.gallery.find((item) => item.type === 'video' || item.type === 'youtube') || null)

const photoItems = computed(() => props.gallery.filter((item) => item.type === 'image'))

function getYoutubeEmbed(url: string) {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]+)/)
  return match ? `https://www.youtube.com/embed/${match[1]}` : url
}

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      isVisible.value = true
      observer.disconnect()
    }
  }, { threshold: 0.05 })

  if (sectionRef.value) observer.observe(sectionRef.value)
})

</script>

<style scoped>
.luxury-gallery {
  background:
    radial-gradient(circle at 10% 15%, rgba(193, 149, 65, 0.14), transparent 35%),
    radial-gradient(circle at 82% 80%, rgba(193, 149, 65, 0.1), transparent 35%),
    #000;
}
</style>
