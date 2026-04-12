<template>
  <section ref="sectionRef" class="luxury-rsvp section-enter py-20 px-6" :class="{ visible: isVisible }">
    <div class="max-w-2xl mx-auto text-center mb-12">
      <p class="font-script text-4xl text-amber-300 mb-2">Will You Come?</p>
      <h2 class="font-serif text-3xl font-semibold text-white">RSVP</h2>
      <div class="w-24 h-px bg-amber-400/50 mx-auto my-4" />
      <p class="text-zinc-400 text-sm">Please kindly confirm your attendance</p>
    </div>

    <div class="max-w-xl mx-auto">
      <div v-if="submitted" class="text-center py-10">
        <div class="text-6xl mb-4">🎊</div>
        <h3 class="font-serif text-2xl text-amber-100 mb-2">Thank you, {{ submittedName }}!</h3>
        <p class="text-zinc-300">Your RSVP has been received. We look forward to celebrating with you!</p>
      </div>

      <form v-else @submit.prevent="submitRsvp" class="bg-[#FBF4E2] rounded-2xl p-8 space-y-5 shadow-lg">
        <div>
          <label class="form-label-luxury">Your Name *</label>
          <input v-model="form.guestName" type="text" class="form-input-luxury" placeholder="Full name" required />
        </div>
        <div>
          <label class="form-label-luxury">Phone Number</label>
          <input v-model="form.phone" type="tel" class="form-input-luxury" placeholder="+62 812 3456 7890" />
        </div>
        <div>
          <label class="form-label-luxury">Attendance *</label>
          <div class="flex gap-6 mt-2">
            <label v-for="opt in attendanceOptions" :key="opt.value" class="flex items-center gap-2 cursor-pointer">
              <input v-model="form.attendance" type="radio" :value="opt.value" class="accent-amber-700" required />
              <span class="text-sm text-zinc-700">{{ opt.icon }} {{ opt.label }}</span>
            </label>
          </div>
        </div>
        <div v-if="form.attendance === 'yes'">
          <label class="form-label-luxury">Number of Guests</label>
          <input v-model.number="form.guestCount" type="number" min="1" max="10" class="form-input-luxury" />
        </div>
        <div>
          <label class="form-label-luxury">Message (Optional)</label>
          <textarea v-model="form.message" class="form-input-luxury min-h-[80px] resize-none" placeholder="Write your message..." />
        </div>

        <div v-if="error" class="bg-red-100 text-red-700 text-sm px-4 py-3 rounded-xl border border-red-200">{{ error }}</div>

        <button type="submit" class="btn-golden w-full" :disabled="loading">
          <span v-if="loading">Sending...</span>
          <span v-else>Send RSVP ❤️</span>
        </button>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{ invitationId: string }>()

const sectionRef = ref<HTMLElement>()
const isVisible = ref(false)
const submitted = ref(false)
const submittedName = ref('')
const loading = ref(false)
const error = ref('')

const form = reactive({ guestName: '', phone: '', attendance: '', guestCount: 1, message: '' })

const attendanceOptions = [
  { value: 'yes', label: 'Yes, I\'ll be there', icon: '✅' },
  { value: 'no', label: 'Regretfully decline', icon: '❌' },
]

async function submitRsvp() {
  error.value = ''
  loading.value = true
  try {
    await $fetch('/api/rsvp', {
      method: 'POST',
      body: { ...form, invitationId: props.invitationId }
    })
    submittedName.value = form.guestName
    submitted.value = true
  } catch (e: unknown) {
    const err = e as { data?: { message?: string }; message?: string }
    error.value = err?.data?.message || 'Failed to submit. Please try again.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) { isVisible.value = true; observer.disconnect() }
  }, { threshold: 0.1 })
  if (sectionRef.value) observer.observe(sectionRef.value)
})
</script>

<style scoped lang="postcss">
.luxury-rsvp {
  background:
    radial-gradient(circle at 10% 15%, rgba(193, 149, 65, 0.14), transparent 35%),
    radial-gradient(circle at 82% 80%, rgba(193, 149, 65, 0.1), transparent 35%),
    #000;
}

.form-label-luxury {
  @apply block text-sm font-semibold text-amber-800 mb-2 text-left;
}

.form-input-luxury {
  @apply w-full bg-white border border-amber-400/70 rounded-lg px-4 py-2 text-zinc-800 placeholder:text-zinc-400 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition;
}

.btn-golden {
  @apply w-full bg-gradient-to-r from-amber-600 to-yellow-700 text-white font-semibold py-3 px-4 rounded-lg transition hover:from-amber-500 hover:to-yellow-600 shadow-md;
}
</style>

