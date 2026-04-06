<template>
  <section ref="sectionRef" class="py-28 px-6 bg-gradient-to-b from-rose-900 to-rose-950 text-white section-enter" :class="{ visible: isVisible }">
    <div class="max-w-2xl mx-auto text-center">
      <!-- Petals -->
      <div class="text-4xl mb-8 space-x-4">🌸 💍 🌸</div>

      <p class="font-script text-5xl text-rose-200 mb-6">
        {{ closingMessage || 'Thank you for your love and blessings' }}
      </p>

      <div class="gold-divider" />

      <h2 class="font-elegant text-3xl text-white mt-6 tracking-wide">
        {{ coupleName || `${invitation.brideName} & ${invitation.groomName}` }}
      </h2>

      <p class="text-rose-300 text-sm mt-4 tracking-widest uppercase">With love</p>

      <!-- Share buttons -->
      <div class="mt-10 flex justify-center gap-4 flex-wrap">
        <button @click="shareWhatsApp" class="btn-gold text-sm px-5 py-2">
          📱 Share via WhatsApp
        </button>
        <button @click="copyLink" class="btn-outline border-rose-300 text-rose-200 hover:bg-rose-200 hover:text-rose-900 text-sm px-5 py-2">
          {{ linkCopied ? '✅ Link Copied!' : '🔗 Copy Link' }}
        </button>
      </div>

      <p class="text-rose-500 text-xs mt-12">Made with ❤️ · Wedding Invitation Platform</p>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  invitation: { brideName: string; groomName: string; slug?: string }
  closingMessage?: string
  coupleName?: string
}>()

const sectionRef = ref<HTMLElement>()
const isVisible = ref(false)
const linkCopied = ref(false)

function shareWhatsApp() {
  const url = window.location.href
  const text = `You're invited to the wedding of ${props.invitation.groomName} & ${props.invitation.brideName}! 💍\n\n${url}`
  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank')
}

async function copyLink() {
  await navigator.clipboard.writeText(window.location.href).catch(() => {})
  linkCopied.value = true
  setTimeout(() => { linkCopied.value = false }, 2000)
}

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) { isVisible.value = true; observer.disconnect() }
  }, { threshold: 0.1 })
  if (sectionRef.value) observer.observe(sectionRef.value)
})
</script>
