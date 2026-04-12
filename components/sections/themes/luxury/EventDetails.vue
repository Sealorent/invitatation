<template>
  <section
    ref="sectionRef"
    class="luxury-event-details section-enter px-4 py-10 sm:px-6 md:py-16"
    :class="{ visible: isVisible }"
  >
    <div class="luxury-event-bg" aria-hidden="true" />

    <div class="relative z-10 mx-auto max-w-6xl text-center text-white">
      <p class="mb-2 text-[15px] uppercase tracking-[0.34em] text-zinc-400 md:text-xs md:tracking-[0.38em]">
        Wedding Event
      </p>
      <!-- For Free Texts -->
      <div v-if="freeTexts.length" class="max-w-4xl mx-auto pt-4 space-y-2">
        <div
          v-for="(freeText, textIdx) in freeTexts"
          :key="`luxury-bride-groom-free-text-${textIdx}`"
          class="text-xs text-zinc-200 leading-relaxed md:text-sm [&_p]:mb-2 [&_ul]:list-disc [&_ul]:ml-5 [&_ol]:list-decimal [&_ol]:ml-5"
          v-html="freeText"
        />
      </div>
    </div>

    <div class="relative z-10 mx-auto mt-6 flex max-w-3xl flex-col gap-5 md:mt-10 md:gap-8">
      <article
        v-for="(event, index) in events"
        :key="event.id"
        class="event-row"
        :class="index % 2 === 0 ? 'event-row-left' : 'event-row-right'"
      >
        <div class="event-label" :class="index % 2 === 0 ? 'event-label-left' : 'event-label-right'">
          <span>{{ event.title }}</span>
        </div>

        <div class="event-card">
          <div class="event-card-overlay" />
          <div class="relative z-10 mx-auto flex max-w-xl flex-col items-center px-4 py-6 text-center sm:px-6 md:px-8 md:py-9">
            <p class="font-serif text-lg text-white md:text-2xl">
              {{ formatDate(event.date) }}
            </p>
            <p class="mt-2 text-base font-semibold text-zinc-100 md:text-xl">
              Pukul: {{ event.time }}
            </p>
            <p class="mt-2 text-base text-zinc-100 md:text-xl">
              Bertempat Di :
            </p>
            <p class="mt-2 font-semibold text-xl leading-tight text-white md:text-3xl">
              {{ event.venue }}
            </p>
            <p class="mt-2 max-w-md text-base leading-relaxed text-zinc-100 md:text-lg">
              {{ event.address }}
            </p>

            <a
              v-if="event.mapsLink"
              :href="event.mapsLink"
              target="_blank"
              class="mt-5 inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm text-zinc-900 shadow-sm transition hover:bg-zinc-100"
            >
              <span aria-hidden="true">📍</span>
              <span>Open Maps</span>
            </a>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  events: Array<{
    id: string
    title: string
    date: string | Date
    time: string
    venue: string
    address: string
    mapsLink?: string
    type: string
  }>
  freeTexts?: string[]
}>()

const sectionRef = ref<HTMLElement>()
const isVisible = ref(false)
const freeTexts = computed(() => props.freeTexts || [])

function formatDate(date: string | Date) {
  return new Date(date as string).toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        isVisible.value = true
        observer.disconnect()
      }
    },
    { threshold: 0.1 }
  )

  if (sectionRef.value) observer.observe(sectionRef.value)
})
</script>

<style scoped>
.luxury-event-details {
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(circle at top center, rgba(255, 255, 255, 0.08), transparent 32%),
    linear-gradient(180deg, #050505 0%, #0b0b0b 100%);
}

.luxury-event-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(circle at 12% 18%, rgba(198, 149, 72, 0.16), transparent 30%),
    radial-gradient(circle at 88% 90%, rgba(181, 130, 52, 0.12), transparent 28%),
    repeating-linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.018) 0,
      rgba(255, 255, 255, 0.018) 2px,
      rgba(0, 0, 0, 0) 2px,
      rgba(0, 0, 0, 0) 8px
    );
  opacity: 0.9;
}

.event-row {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 3.4rem minmax(0, 1fr);
  align-items: stretch;
  gap: 0;
}

.event-row-left {
  grid-template-columns: 3.4rem minmax(0, 1fr);
}

.event-row-right {
  grid-template-columns: minmax(0, 1fr) 3.4rem;
}

.event-row-left .event-label {
  order: 1;
}

.event-row-left .event-card {
  order: 2;
}

.event-row-right .event-label {
  order: 2;
}

.event-row-right .event-card {
  order: 1;
}

.event-label {
  min-height: 100%;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01)),
    repeating-linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.02) 0,
      rgba(255, 255, 255, 0.02) 2px,
      rgba(0, 0, 0, 0.06) 2px,
      rgba(0, 0, 0, 0.06) 6px
    ),
    #111;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-weight: 600;
  font-size: clamp(1.4rem, 5.5vw, 1.9rem);
  padding: 0;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
}

.event-label span {
  display: inline-block;
}

.event-label-left,
.event-label-right {
  text-align: center;
}

.event-card {
  position: relative;
  min-height: 16.5rem;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 1rem;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.1)),
    radial-gradient(circle at top center, rgba(255, 255, 255, 0.08), transparent 30%),
    #0a0a0a;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.35);
}

.event-card-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(0, 0, 0, 0.22), rgba(0, 0, 0, 0.38)),
    radial-gradient(circle at center, rgba(255, 255, 255, 0.06), transparent 60%);
}

@media (min-width: 768px) {
  .event-row {
    grid-template-columns: 5.5rem minmax(0, 1fr);
  }

  .event-row-left {
    grid-template-columns: 5.5rem minmax(0, 1fr);
  }

  .event-row-right {
    grid-template-columns: minmax(0, 1fr) 5.5rem;
  }

  .event-row-left .event-label {
    order: 1;
  }

  .event-row-left .event-card {
    order: 2;
  }

  .event-row-right .event-label {
    order: 2;
  }

  .event-row-right .event-card {
    order: 1;
  }

  .event-label {
    font-size: clamp(1.8rem, 2.7vw, 2.8rem);
    letter-spacing: 0.16em;
  }

  .event-card {
    min-height: 22rem;
    border-radius: 0;
  }
}
</style>
