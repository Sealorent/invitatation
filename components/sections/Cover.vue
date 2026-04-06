<template>
  <section
    ref="sectionRef"
    class="relative min-h-screen flex items-end justify-center overflow-hidden section-enter"
    :class="{ visible: isVisible }"
  >
    <!-- Background image -->
    <div class="absolute inset-0 z-0">
      <img
        v-if="coverPhoto"
        :src="coverPhoto"
        alt="Cover"
        class="w-full h-full object-cover"
      />
      <div v-else class="w-full h-full bg-gradient-to-br from-rose-900 via-rose-800 to-pink-900" />
      <div class="absolute inset-0 cover-overlay" />
    </div>

    <!-- Floating petals decoration -->
    <div class="absolute inset-0 z-1 pointer-events-none overflow-hidden">
      <div class="petal" style="left:5%;animation-duration:8s">🌸</div>
      <div class="petal" style="left:20%;animation-duration:12s;animation-delay:2s">🌺</div>
      <div class="petal" style="left:50%;animation-duration:9s;animation-delay:1s">🌸</div>
      <div class="petal" style="left:75%;animation-duration:11s;animation-delay:3s">🌹</div>
      <div class="petal" style="left:90%;animation-duration:7s;animation-delay:4s">🌸</div>
    </div>

    <!-- Content -->
    <div class="relative z-10 text-center text-white pb-16 px-6">
      <!-- Guest greeting -->
      <div v-if="guestName" class="mb-6 animate-fade-in">
        <p class="text-sm uppercase tracking-[0.3em] text-rose-200 mb-1">Kepada Yth : </p>
        <p class="text-sm uppercase tracking-[0.3em] text-rose-200 mb-1">Bapak/Ibu/Saudara/i</p>
        <p class="font-script text-3xl text-rose-100">{{ guestName }}</p>
      </div>

      <!-- Invitation text -->
      <p class="text-sm uppercase tracking-[0.4em] text-rose-200 mb-4 animate-fade-in">
        We invite you to celebrate the marriage of
      </p>

      <!-- Names -->
      <div class="animate-slide-up">
        <h1 class="font-script text-6xl md:text-8xl text-white mb-2">
          {{ invitation.brideName }}
        </h1>
        <p class="font-elegant text-2xl text-rose-200 mb-2">&</p>
        <h1 class="font-script text-6xl md:text-8xl text-white mb-6">
          {{ invitation.groomName }}
        </h1>
      </div>

      <!-- Date -->
      <div class="mb-10">
        <div class="gold-divider mx-auto" />
        <p class="font-elegant text-lg text-rose-100 tracking-widest uppercase mt-4">
          {{ formatDate(invitation.weddingDate) }}
        </p>
      </div>

      <!-- Open button -->
      <button
        v-if="!opened"
        @click="openInvitation"
        class="btn-gold px-10 py-4 text-lg animate-pulse-soft"
      >
        Open Invitation ✉️
      </button>

      <!-- Scroll hint after open -->
      <div v-if="opened" class="animate-bounce mt-4">
        <p class="text-rose-200 text-sm">Scroll to explore ↓</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  invitation: {
    brideName: string
    groomName: string
    weddingDate: string | Date
    coverPhoto?: string | null
  }
  guestName?: string
}>()

const emit = defineEmits(['open'])

const sectionRef = ref<HTMLElement>()
const isVisible = ref(false)
const opened = ref(false)
const coverPhoto = computed(() => props.invitation.coverPhoto || '')

function formatDate(date: string | Date) {
  return new Date(date as string).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })
}

function openInvitation() {
  opened.value = true
  emit('open')
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
