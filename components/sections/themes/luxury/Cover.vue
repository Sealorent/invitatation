<template>
  <section
    ref="sectionRef"
    class="relative min-h-screen flex items-end justify-center overflow-hidden section-enter"
    :class="{ visible: isVisible }"
  >
    <div class="absolute inset-0 z-0">
      <img
        v-if="coverPhoto"
        :src="coverPhoto"
        alt="Cover"
        class="w-full h-full object-cover"
      />
      <div v-else class="w-full h-full bg-black" />
      <div class="absolute inset-0 bg-gradient-to-b from-black/25 via-black/35 to-black/60" />
      <div class="absolute inset-0 opacity-35" style="background-image: radial-gradient(circle at 30% 20%, rgba(255,215,120,0.5), transparent 35%), radial-gradient(circle at 75% 80%, rgba(255,235,180,0.38), transparent 40%);" />
    </div>

    <div class="relative z-10 text-center text-white pb-14 sm:pb-16 px-6 max-w-3xl">
      <div v-if="guestName" class="mb-6 sm:mb-8 animate-fade-in">
        <p class="text-[11px] uppercase tracking-[0.32em] text-amber-100 mb-1">Kepada Yth :</p>
        <p class="text-[11px] uppercase tracking-[0.32em] text-amber-100 mb-1">Bapak/Ibu/Saudara/i</p>
        <p class="font-script text-2xl sm:text-3xl text-amber-50">{{ guestName }}</p>
      </div>

      <p class="text-[11px] sm:text-xs uppercase tracking-[0.35em] text-amber-100 mb-4 sm:mb-5 animate-fade-in">
        We invite you to celebrate the marriage of
      </p>

      <div class="animate-slide-up">
        <h1 class="font-script text-5xl sm:text-6xl md:text-8xl text-amber-50 leading-tight mb-1">
          {{ invitation.brideName }}
        </h1>
        <p class="font-elegant text-2xl text-yellow-200 mb-1">&</p>
        <h1 class="font-script text-5xl sm:text-6xl md:text-8xl text-amber-50 leading-tight mb-5 sm:mb-6">
          {{ invitation.groomName }}
        </h1>
      </div>

      <div class="mb-8 sm:mb-10">
        <div class="h-px w-44 sm:w-52 mx-auto bg-gradient-to-r from-transparent via-amber-300 to-transparent" />
        <p class="font-elegant text-sm sm:text-base text-amber-100 tracking-[0.18em] uppercase mt-3 sm:mt-4">
          {{ formatDate(invitation.weddingDate) }}
        </p>
      </div>

      <button
        v-if="!opened"
        @click="openInvitation"
        class="px-8 sm:px-10 py-3 sm:py-4 text-sm sm:text-lg uppercase tracking-[0.14em] rounded-md border border-amber-200/70 text-amber-50 bg-gradient-to-r from-amber-500 to-yellow-600 shadow-[0_14px_35px_rgba(160,98,14,0.38)] hover:brightness-105 transition"
      >
        Open Invitation
      </button>

      <div v-if="opened" class="animate-bounce mt-4">
        <p class="text-amber-100 text-sm">Scroll to explore ↓</p>
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
  onOpen?: () => void
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
  props.onOpen?.()
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
