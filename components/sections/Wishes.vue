<template>
  <section ref="sectionRef" class="py-20 px-6 romantic-bg section-enter" :class="{ visible: isVisible }">
    <div class="max-w-3xl mx-auto text-center mb-12">
      <p class="font-script text-4xl text-rose-400 mb-2">Kind Words</p>
      <h2 class="font-serif text-3xl font-semibold text-rose-800">Guest Wishes</h2>
      <div class="gold-divider" />
    </div>

    <div class="max-w-3xl mx-auto">
      <!-- Send wish form -->
      <div class="card-romantic p-6 mb-8">
        <h3 class="font-serif text-lg text-rose-700 mb-4">Leave a Message 💌</h3>
        <div v-if="wishSent" class="text-center py-4">
          <span class="text-4xl">💕</span>
          <p class="text-rose-600 mt-2 font-medium">Your wishes have been sent!</p>
        </div>
        <form v-else @submit.prevent="sendWish" class="space-y-3">
          <input v-model="wishForm.name" type="text" class="form-input" placeholder="Your name" required />
          <textarea v-model="wishForm.message" class="form-input min-h-[80px] resize-none" placeholder="Write your congratulations..." required />
          <button type="submit" class="btn-primary text-sm" :disabled="wishLoading">
            {{ wishLoading ? 'Sending...' : 'Send Wishes 💌' }}
          </button>
        </form>
      </div>

      <!-- Wishes list -->
      <div class="space-y-4">
        <div
          v-for="wish in localWishes"
          :key="wish.id"
          class="card-romantic p-5 flex gap-4"
        >
          <div class="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-500 font-bold flex-shrink-0 text-sm">
            {{ wish.name.charAt(0).toUpperCase() }}
          </div>
          <div>
            <p class="font-medium text-rose-800 text-sm">{{ wish.name }}</p>
            <p class="text-gray-600 text-sm mt-1 leading-relaxed">{{ wish.message }}</p>
            <p class="text-xs text-gray-400 mt-2">{{ formatTime(wish.createdAt) }}</p>
          </div>
        </div>

        <div v-if="localWishes.length === 0" class="text-center text-gray-400 py-8 text-sm">
          Be the first to send your wishes 💕
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Wish { id: string; name: string; message: string; createdAt: string }
const props = defineProps<{ invitationId: string; wishes: Wish[] }>()

const sectionRef = ref<HTMLElement>()
const isVisible = ref(false)
const wishSent = ref(false)
const wishLoading = ref(false)
const wishForm = reactive({ name: '', message: '' })
const localWishes = ref([...props.wishes])

async function sendWish() {
  wishLoading.value = true
  try {
    const newWish = await $fetch<Wish>('/api/wishes', {
      method: 'POST',
      body: { ...wishForm, invitationId: props.invitationId }
    })
    localWishes.value.unshift(newWish)
    wishSent.value = true
  } catch {
    // silent
  } finally {
    wishLoading.value = false
  }
}

function formatTime(date: string) {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) { isVisible.value = true; observer.disconnect() }
  }, { threshold: 0.1 })
  if (sectionRef.value) observer.observe(sectionRef.value)
})
</script>
