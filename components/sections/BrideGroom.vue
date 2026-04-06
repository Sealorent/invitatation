<template>
  <section ref="sectionRef" class="py-20 px-6 romantic-bg section-enter bride-groom-section" :class="{ visible: isVisible }">
    <div class="max-w-4xl mx-auto text-center bride-groom-header">
      <p class="font-script text-4xl text-rose-400 mb-2">The Wedding Couple</p>
      <h2 class="font-serif text-3xl font-semibold text-rose-800 mb-4">Bride &amp; Groom</h2>
      <div class="gold-divider" />

      <!-- free texts -->
      <div v-if="freeTexts.length" class="max-w-3xl mx-auto px-6 pt-2 pb-4 space-y-2">
        <div
          v-for="(freeText, textIdx) in freeTexts"
          :key="`bride-groom-free-text-${textIdx}`"
          class="text-sm text-center text-gray-600 leading-relaxed [&_p]:mb-2 [&_ul]:list-disc [&_ul]:ml-5 [&_ol]:list-decimal [&_ol]:ml-5"
          v-html="freeText"
        />
      </div>
    </div>

    <div class="max-w-4xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 gap-12 bride-groom-grid">
      <!-- Bride -->
      <div class="text-center bride-groom-card bride-card">
        <div class="luxury-role-tag" aria-hidden="true">THE BRIDE</div>
        <div class="relative inline-block mb-6 portrait-shell">
          <div class="w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-rose-200 shadow-xl portrait-frame">
            <img
              v-if="brideData.photo"
              :src="brideData.photo"
              :alt="brideData.name"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full bg-rose-100 flex items-center justify-center">
              <span class="text-6xl">👰</span>
            </div>
          </div>
          <div class="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-rose-400 flex items-center justify-center text-white">
            🌸
          </div>
        </div>
        <div class="profile-copy">
          <p class="text-gray-400 text-xs uppercase tracking-widest mb-1">The Bride</p>
          <h3 class="font-script text-4xl text-rose-700 mb-2">{{ brideData.name }}</h3>
          <p v-if="brideData.fatherName" class="text-gray-600 text-sm">
          Putri Ketiga dari <strong>{{ brideData.fatherName }}</strong>
          <span v-if="brideData.motherName"> &amp; <strong>{{ brideData.motherName }}</strong></span>
          </p>
          <a v-if="brideData.instagram" :href="`https://instagram.com/${brideData.instagram}`" target="_blank" class="inline-flex items-center gap-1 text-rose-400 text-sm mt-2 hover:text-rose-600 transition-colors">
            📸 {{ brideData.instagram }}
          </a>
        </div>
      </div>

      <!-- Divider -->
      <div class="hidden md:flex items-center justify-center">
        <div class="text-center">
          <p class="font-script text-5xl text-rose-300">&amp;</p>
        </div>
      </div>

      <!-- Groom -->
      <div class="text-center md:col-start-2 bride-groom-card groom-card">
        <div class="luxury-role-tag" aria-hidden="true">THE GROOM</div>
        <div class="relative inline-block mb-6 portrait-shell">
          <div class="w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-rose-200 shadow-xl portrait-frame">
            <img
              v-if="groomData.photo"
              :src="groomData.photo"
              :alt="groomData.name"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full bg-blue-50 flex items-center justify-center">
              <span class="text-6xl">🤵</span>
            </div>
          </div>
          <div class="absolute -bottom-2 -left-2 w-10 h-10 rounded-full bg-rose-400 flex items-center justify-center text-white">
            🌸
          </div>
        </div>
        <div class="profile-copy">
          <p class="text-gray-400 text-xs uppercase tracking-widest mb-1">The Groom</p>
          <h3 class="font-script text-4xl text-rose-700 mb-2">{{ groomData.name }}</h3>
          <p v-if="groomData.fatherName" class="text-gray-600 text-sm">
          Putra Pertama dari <strong>{{ groomData.fatherName }}</strong>
          <span v-if="groomData.motherName"> &amp; <strong>{{ groomData.motherName }}</strong></span>
          </p>
          <a v-if="groomData.instagram" :href="`https://instagram.com/${groomData.instagram}`" target="_blank" class="inline-flex items-center gap-1 text-rose-400 text-sm mt-2 hover:text-rose-600 transition-colors">
            📸 {{ groomData.instagram }}
          </a>
        </div>
      </div>
    </div>
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
    if (entries[0].isIntersecting) { isVisible.value = true; observer.disconnect() }
  }, { threshold: 0.1 })
  if (sectionRef.value) observer.observe(sectionRef.value)
})
</script>
