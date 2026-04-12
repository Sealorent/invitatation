<template>
  <section
    ref="sectionRef"
    class="luxury-love-story section-enter px-5 py-10 sm:px-6 md:py-16"
    :class="{ visible: isVisible }"
  >
    <div class="luxury-love-bg" aria-hidden="true" />

    <div class="relative z-10 mx-auto max-w-3xl text-white">
      <div class="flex items-center gap-3">
        <h2 class="font-serif text-4xl italic leading-none text-zinc-100 md:text-5xl">Our Stories</h2>
        <div class="h-px flex-1 bg-zinc-300/70" />
      </div>
<!-- 
      <p class="mt-4 text-right font-serif text-xl italic leading-snug text-zinc-100 md:text-2xl">
        <span class="quote-chip">Every Love Story Is Beautiful,</span><br>
        <span class="quote-chip">But Ours Is My Favorite.</span>
      </p> -->

      <div v-if="freeTexts.length" class="mt-5 space-y-2 text-right ">
        <div
          v-for="(freeText, textIdx) in freeTexts"
          :key="`luxury-love-story-free-text-${textIdx}`"
          class="text-sm leading-relaxed text-zinc-300 [&_p]:mb-2 [&_ul]:ml-5 [&_ul]:list-disc [&_ol]:ml-5 [&_ol]:list-decimal font-serif text-xl italic leading-snug text-zinc-100 md:text-2xl"
          v-html="freeText"
        />
      </div>
    </div>

    <div class="relative z-10 mx-auto mt-6 flex max-w-3xl flex-col gap-8 md:mt-10 md:gap-10">
      <article
        v-for="(story, index) in stories"
        :key="story.id"
        class="story-item flex flex-col gap-4 md:flex-row md:items-stretch md:gap-8"
        :class="index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'"
      >
        <div class="story-media-wrap md:w-1/2">
          <img
            v-if="storyCover(story)"
            :src="storyCover(story)"
            :alt="story.title"
            class="story-media"
          >
          <div v-else class="story-media story-fallback">No Photo</div>

          <button
            v-if="story.photos && story.photos.length > 1"
            type="button"
            class="story-play-indicator"
            aria-label="Multiple photos available"
          >
            ▶
          </button>
        </div>

        <div
          class="pt-1 md:w-1/2 md:pt-0 md:flex md:flex-col md:justify-center"
          :class="index % 2 === 0 ? 'text-left' : 'text-right md:text-right'"
        >
          <h3 class="font-serif text-5xl leading-tight text-zinc-100 md:text-6xl">{{ story.title }}</h3>
          <p v-if="story.year" class="mt-1 font-serif text-4xl text-zinc-200 md:text-5xl">{{ story.year }}</p>

          <div
            v-if="story.subtitle"
            class="mt-3 text-[20px] leading-relaxed text-zinc-100 md:text-3xl [&_p]:mb-2"
            v-html="story.subtitle"
          />
          <p v-else-if="story.description" class="mt-3 text-xs leading-relaxed text-zinc-100 md:text-sm">
            {{ story.description }}
          </p>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
interface StoryItem {
  id: string
  year?: string
  title: string
  subtitle?: string
  description?: string
  photo?: string
  photos?: string[]
}

const props = defineProps<{
  stories: StoryItem[]
  freeTexts?: string[]
}>()

const sectionRef = ref<HTMLElement>()
const isVisible = ref(false)
const freeTexts = computed(() => props.freeTexts || [])

function storyCover(story: StoryItem) {
  if (Array.isArray(story.photos) && story.photos.length > 0) return story.photos[0]
  return story.photo || ''
}

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      isVisible.value = true
      observer.disconnect()
    }
  }, { threshold: 0.1 })

  if (sectionRef.value) observer.observe(sectionRef.value)
})
</script>

<style scoped>
.luxury-love-story {
  position: relative;
  overflow: hidden;
  background: linear-gradient(180deg, #020202 0%, #090909 100%);
}

.luxury-love-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(circle at 8% 12%, rgba(192, 134, 38, 0.18), transparent 30%),
    radial-gradient(circle at 86% 78%, rgba(174, 128, 42, 0.14), transparent 34%),
    repeating-linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.02) 0,
      rgba(255, 255, 255, 0.02) 2px,
      rgba(255, 255, 255, 0) 2px,
      rgba(255, 255, 255, 0) 8px
    );
}

.quote-chip {
  background: linear-gradient(135deg, #3d1fb0, #5f2ed8);
  padding: 0.08em 0.2em;
}

.story-item {
  position: relative;
}

.story-media-wrap {
  position: relative;
  border-radius: 1.7rem;
  overflow: hidden;
}

.story-item:nth-child(even) .story-media-wrap {
  margin-left: auto;
}

.story-item:nth-child(odd) .story-media-wrap {
  margin-right: auto;
}

.story-media {
  width: 100%;
  height: 17.5rem;
  object-fit: cover;
  display: block;
}

.story-fallback {
  background: linear-gradient(180deg, #1b1b1b, #0d0d0d);
  color: #d4d4d8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}

.story-play-indicator {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 2rem;
  height: 2rem;
  border-radius: 999px;
  border: 0;
  background: rgba(255, 255, 255, 0.92);
  color: #111827;
  font-size: 0.8rem;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

@media (min-width: 768px) {
  .story-media {
    height: 25rem;
  }
}
</style>
