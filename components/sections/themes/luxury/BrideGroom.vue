<template>
  <section
    ref="sectionRef"
    class="py-14 md:py-20 px-0 bg-black text-white section-enter overflow-hidden"
    :class="{ visible: isVisible }"
  >
    <div class="max-w-6xl mx-auto px-6 text-center mb-8 md:mb-12">
      <!-- <p class="text-[11px] uppercase tracking-[0.35em] text-zinc-400 mb-2">The Wedding Couple</p>
      <h2 class="font-serif text-3xl md:text-4xl text-white mb-3">Bride &amp; Groom</h2>
      <div class="h-px w-48 mx-auto bg-gradient-to-r from-transparent via-zinc-300 to-transparent" /> -->

      <div v-if="freeTexts.length" class="max-w-4xl mx-auto pt-4 space-y-2">
        <div
          v-for="(freeText, textIdx) in freeTexts"
          :key="`luxury-bride-groom-free-text-${textIdx}`"
          class="text-sm text-zinc-200 leading-relaxed [&_p]:mb-2 [&_ul]:list-disc [&_ul]:ml-5 [&_ol]:list-decimal [&_ol]:ml-5"
          v-html="freeText"
        />
      </div>
    </div>

    <!-- Bride block -->
    <article class="max-w-6xl mx-auto pl-12 pr-0 md:px-0 mb-8 md:mb-12 md:ml-10 md:mr-6">
      <div class="couple-frame">
        <div class="photo-stage">
          <div class="role-strip bride-strip">THE BRIDE</div>
          <template v-if="brideData.photo">
            <div class="photo-motion">
              <img :src="brideData.photo" :alt="brideData.name" class="photo-layer photo-color" />
              <img :src="brideData.photo" :alt="`${brideData.name} grayscale`" class="photo-layer photo-gray" />
            </div>
          </template>
          <div v-else class="w-full h-full flex items-center justify-center text-6xl bg-zinc-800">👰</div>
        </div>
      </div>

      <div class="max-w-6xl mx-auto px-4 md:pl-10 md:pr-6 pt-3 text-right">
        <h3 class="font-script text-3xl md:text-5xl text-zinc-100">{{ brideData.name }}</h3>
        <p v-if="brideData.fatherName" class="text-sm md:text-base text-zinc-200 mt-2">
          Putri dari <strong>{{ brideData.fatherName }}</strong>
          <span v-if="brideData.motherName"> &amp; <strong>{{ brideData.motherName }}</strong></span>
        </p>
        <a
          v-if="brideData.instagram"
          :href="`https://instagram.com/${brideData.instagram}`"
          target="_blank"
          class="inline-flex items-center gap-1 mt-3 px-3 py-1 rounded-md bg-zinc-100 text-zinc-900 text-sm"
        >
          @{{ brideData.instagram }}
        </a>
      </div>
    </article>

    <div class="max-w-6xl mx-auto px-4 md:px-6 mb-8 md:mb-10 flex items-center gap-4">
      <div class="h-px flex-1 bg-zinc-300" />
      <span class="text-4xl leading-none text-zinc-100">♡</span>
      <div class="h-px flex-1 bg-zinc-300" />
    </div>

    <!-- Groom block -->
    <article class="max-w-6xl mx-auto pl-0 pr-12 md:px-0 md:ml-6 md:mr-10">
      <div class="couple-frame">
        <div class="photo-stage">
          <div class="role-strip groom-strip">THE GROOM</div>
          <template v-if="groomData.photo">
            <div class="photo-motion">
              <img :src="groomData.photo" :alt="groomData.name" class="photo-layer photo-color" />
              <img :src="groomData.photo" :alt="`${groomData.name} grayscale`" class="photo-layer photo-gray" />
            </div>
          </template>
          <div v-else class="w-full h-full flex items-center justify-center text-6xl bg-zinc-800">🤵</div>
        </div>
      </div>

      <div class="max-w-6xl mx-auto px-4 md:pl-6 md:pr-10 pt-3 text-left">
        <h3 class="font-script text-3xl md:text-5xl text-zinc-100">{{ groomData.name }}</h3>
        <p v-if="groomData.fatherName" class="text-sm md:text-base text-zinc-200 mt-2">
          Putra dari <strong>{{ groomData.fatherName }}</strong>
          <span v-if="groomData.motherName"> &amp; <strong>{{ groomData.motherName }}</strong></span>
        </p>
        <a
          v-if="groomData.instagram"
          :href="`https://instagram.com/${groomData.instagram}`"
          target="_blank"
          class="inline-flex items-center gap-1 mt-3 px-3 py-1 rounded-md bg-zinc-100 text-zinc-900 text-sm"
        >
          @{{ groomData.instagram }}
        </a>
      </div>
    </article>
  </section>
</template>

<script setup lang="ts">
interface CoupleProfile {
  name?: string
  photo?: string
  fatherName?: string
  motherName?: string
  instagram?: string
}

const props = defineProps<{
  invitation: {
    brideName: string
    groomName: string
  }
  brideProfile?: CoupleProfile | null
  groomProfile?: CoupleProfile | null
  freeTexts?: string[]
}>()

const sectionRef = ref<HTMLElement>()
const isVisible = ref(false)

const brideData = computed(() => ({
  name: props.brideProfile?.name || props.invitation.brideName,
  photo: props.brideProfile?.photo || '',
  fatherName: props.brideProfile?.fatherName || '',
  motherName: props.brideProfile?.motherName || '',
  instagram: props.brideProfile?.instagram || '',
}))

const groomData = computed(() => ({
  name: props.groomProfile?.name || props.invitation.groomName,
  photo: props.groomProfile?.photo || '',
  fatherName: props.groomProfile?.fatherName || '',
  motherName: props.groomProfile?.motherName || '',
  instagram: props.groomProfile?.instagram || '',
}))

const freeTexts = computed(() => props.freeTexts || [])

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
.couple-frame {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-items: stretch;
  background: #0b0b0b;
}

.role-strip {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 22%;
  background: rgba(243, 243, 243, 0.96);
  color: #0b0b0b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-weight: 700;
  font-size: clamp(1.6rem, 4.2vw, 3rem);
  letter-spacing: 0.08em;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  text-transform: uppercase;
  z-index: 3;
  pointer-events: none;
}

.bride-strip {
  left: 0;
}

.groom-strip {
  right: 0;
}

.photo-stage {
  position: relative;
  min-height: 17rem;
  overflow: hidden;
}

.photo-motion {
  position: absolute;
  inset: 0;
  animation: none;
}

.photo-layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-color {
  filter: saturate(1.08) contrast(1.02);
  animation: fadeColor 12s ease-in-out infinite;
}

.photo-gray {
  filter: grayscale(1);
  opacity: 0;
  mix-blend-mode: screen;
  animation: fadeGray 12s ease-in-out infinite;
}

@keyframes fadeColor {
  0%, 35% { opacity: 1; }
  50%, 85% { opacity: 0.22; }
  100% { opacity: 1; }
}

@keyframes fadeGray {
  0%, 35% { opacity: 0; }
  50%, 85% { opacity: 0.72; }
  100% { opacity: 0; }
}

@media (max-width: 900px) {
  .photo-stage {
    min-height: 17rem;
  }
}

@media (min-width: 900px) {
  .role-strip {
    width: 18%;
  }

  .photo-stage {
    min-height: 24rem;
  }

  .photo-motion {
    animation: none;
  }
}
</style>
