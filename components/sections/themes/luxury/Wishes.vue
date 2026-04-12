<template>
  <div class="luxury-wishes-section py-16 md:py-24 text-center">
    <div class="max-w-4xl mx-auto px-6" data-aos="fade-up">
      <!-- Section Header -->
      <div class="text-center mb-12">
        <p class="font-display text-lg tracking-[0.2em] uppercase text-amber-400/80 mb-2">
          Kind Words
        </p>
        <h2 class="font-serif text-4xl md:text-5xl text-white mb-4">
          Guest Wishes
        </h2>
        <div class="w-24 h-px bg-amber-500/50 mx-auto" />
      </div>

      <!-- Wishes Form -->
      <div class="max-w-lg mx-auto bg-black/20 border border-amber-800/50 rounded-2xl p-6 md:p-8 shadow-2xl backdrop-blur-sm">
        <form @submit.prevent="submitWish">
          <p class="text-left text-amber-200/70 text-sm mb-4 font-display tracking-widest">
            Leave a Message 💌
          </p>
          <div class="space-y-4 mb-6">
            <div>
              <input
                v-model="form.name"
                type="text"
                placeholder="Your name"
                class="form-input-luxury"
                required
              >
            </div>
            <div>
              <textarea
                v-model="form.message"
                rows="4"
                placeholder="Write your congratulations..."
                class="form-input-luxury"
                required
              />
            </div>
          </div>
          <button type="submit" :disabled="submitting" class="btn-golden w-full">
            <span v-if="submitting">Sending...</span>
            <span v-else>Send Wishes ♥</span>
          </button>
        </form>
        <p v-if="formSubmitted" class="text-green-400 text-sm mt-4">
          Thank you for your lovely wishes!
        </p>
      </div>

      <!-- Display Wishes -->
      <div class="mt-16">
        <div v-if="!localWishes.length" class="text-center py-8">
          <p class="text-amber-200/80">Be the first to send your wishes 💕</p>
        </div>
        <div v-else class="space-y-6 max-w-2xl mx-auto">
          <div
            v-for="wish in displayedWishes"
            :key="wish.id"
            class="bg-black/10 p-5 rounded-lg text-left border border-amber-900/40"
            data-aos="fade-up"
            :data-aos-delay="100"
          >
            <p class="font-semibold text-amber-300 mb-2">{{ wish.name }}</p>
            <p class="text-white/80 text-sm whitespace-pre-wrap">{{ wish.message }}</p>
          </div>
        </div>
        <div v-if="localWishes.length > 3 && !showAllWishes" class="mt-8">
          <button @click="showAllWishes = true" class="btn-show-more">
            Show More
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import AOS from 'aos'

interface Wish {
  id: string
  name: string
  message: string
  createdAt: string
}

const props = defineProps<{
  invitationId: string
  wishes: Wish[]
}>()

const form = reactive({
  name: '',
  message: ''
})

const submitting = ref(false)
const formSubmitted = ref(false)
const localWishes = ref([...props.wishes])
const showAllWishes = ref(false)

const displayedWishes = computed(() => {
  if (showAllWishes.value) {
    return localWishes.value
  }
  return localWishes.value.slice(0, 3)
})

async function submitWish() {
  if (!form.name || !form.message) return

  submitting.value = true
  formSubmitted.value = false
  try {
    const newWish = await $fetch('/api/wishes', {
      method: 'POST',
      body: {
        invitationId: props.invitationId,
        name: form.name,
        message: form.message
      }
    })
    localWishes.value.unshift(newWish)
    form.name = ''
    form.message = ''
    formSubmitted.value = true
    setTimeout(() => { formSubmitted.value = false }, 4000)
  } catch (error) {
    console.error('Error submitting wish:', error)
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  if (process.client) {
    AOS.init({
      duration: 800,
      once: true
    })
  }
})
</script>

<style scoped lang="postcss">
.luxury-wishes-section {
  background:
    radial-gradient(circle at 10% 15%, rgba(193, 149, 65, 0.1), transparent 30%),
    radial-gradient(circle at 90% 85%, rgba(193, 149, 65, 0.08), transparent 40%),
    #1a1a1a;
}

.form-input-luxury {
  @apply w-full bg-white/5 border border-amber-400/30 rounded-lg px-4 py-3 text-white placeholder:text-amber-50/40 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300;
}

.btn-golden {
  @apply w-full bg-gradient-to-r from-amber-600 to-yellow-700 text-white font-semibold py-3 px-4 rounded-lg transition hover:from-amber-500 hover:to-yellow-600 shadow-lg shadow-amber-900/30;
}

.btn-show-more {
  @apply bg-transparent border border-amber-700 text-amber-300 font-semibold py-2 px-6 rounded-lg transition hover:bg-amber-800/20 hover:text-white;
}
</style>

