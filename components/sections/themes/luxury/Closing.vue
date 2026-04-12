<template>
  <div class="relative h-screen w-full overflow-hidden">
    <!-- Background Slideshow -->
    <div
      v-for="(image, index) in gallery"
      :key="image.id"
      class="absolute inset-0 h-full w-full bg-cover bg-center transition-opacity duration-1000"
      :style="{ backgroundImage: `url(${image.url})`, zIndex: 1 }"
      :class="index === currentImageIndex ? 'opacity-100' : 'opacity-0'"
    />

    <!-- Overlay -->
    <div class="absolute inset-0 bg-black/70 z-10" />

    <!-- Content -->
    <div class="relative z-20 flex h-full flex-col items-center justify-end pb-24 md:pb-32 text-center text-white px-6" data-aos="fade-up">
      <p class="font-display text-lg tracking-[0.2em] uppercase text-amber-400/80 mb-4">
        Terimakasih
      </p>

      <div
        v-if="freeTexts && freeTexts.length"
        class="max-w-xl mx-auto mb-8 text-white/90 leading-relaxed [&_p]:mb-3 [&_p:last-child]:mb-0"
        v-html="freeTexts[0]"
      />
      <p v-else class="max-w-xl mx-auto text-base md:text-lg text-white/90 leading-relaxed mb-8">
        Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i, berkenan hadir dan memberikan doa restu kepada kami.
      </p>

      <p class="font-display text-lg tracking-widest text-amber-300/90 mb-2">
        Kami yang berbahagia
      </p>
      <h2 class="font-serif text-4xl md:text-6xl text-white mt-2">
        {{ invitation.brideName }} & {{ invitation.groomName }}
      </h2>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, toRefs } from 'vue'
import AOS from 'aos'

interface GalleryImage {
  id: string
  url: string
}

const props = defineProps<{
  invitation: {
    brideName: string
    groomName: string
  }
  gallery: GalleryImage[]
  freeTexts?: string[]
}>()

const { invitation, gallery, freeTexts } = toRefs(props)

const currentImageIndex = ref(0)
let intervalId: ReturnType<typeof setInterval>

onMounted(() => {
  if (gallery.value && gallery.value.length > 0) {
    intervalId = setInterval(() => {
      currentImageIndex.value = (currentImageIndex.value + 1) % gallery.value.length
    }, 2000) // Change image every 2 seconds
  }

  if (process.client) {
    AOS.init({
      duration: 1200,
      once: true
    })
  }
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})
</script>

