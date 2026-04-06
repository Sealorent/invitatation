<template>
  <section ref="sectionRef" class="py-20 px-6 bg-rose-50 section-enter" :class="{ visible: isVisible }">
    <div class="max-w-2xl mx-auto text-center mb-12">
      <p class="font-script text-4xl text-rose-400 mb-2">Will You Come?</p>
      <h2 class="font-serif text-3xl font-semibold text-rose-800">RSVP</h2>
      <div class="gold-divider" />
      <p class="text-gray-500 text-sm mt-4">Please kindly confirm your attendance</p>
    </div>

    <div class="max-w-xl mx-auto">
      <div v-if="submitted" class="text-center py-10">
        <div class="text-6xl mb-4">🎊</div>
        <h3 class="font-serif text-2xl text-rose-700 mb-2">Thank you, {{ submittedName }}!</h3>
        <p class="text-gray-500">Your RSVP has been received. We look forward to celebrating with you!</p>
      </div>

      <form v-else @submit.prevent="submitRsvp" class="card-romantic p-8 space-y-5">
        <div>
          <label class="form-label">Your Name *</label>
          <input v-model="form.guestName" type="text" class="form-input" placeholder="Full name" required />
        </div>
        <div>
          <label class="form-label">Phone Number</label>
          <input v-model="form.phone" type="tel" class="form-input" placeholder="+62 812 3456 7890" />
        </div>
        <div>
          <label class="form-label">Attendance *</label>
          <div class="flex gap-4 mt-2">
            <label v-for="opt in attendanceOptions" :key="opt.value" class="flex items-center gap-2 cursor-pointer">
              <input v-model="form.attendance" type="radio" :value="opt.value" class="accent-rose-500" required />
              <span class="text-sm text-gray-700">{{ opt.icon }} {{ opt.label }}</span>
            </label>
          </div>
        </div>
        <div v-if="form.attendance === 'yes'">
          <label class="form-label">Number of Guests</label>
          <input v-model.number="form.guestCount" type="number" min="1" max="10" class="form-input" />
        </div>
        <div>
          <label class="form-label">Message (Optional)</label>
          <textarea v-model="form.message" class="form-input min-h-[80px] resize-none" placeholder="Write your message..." />
        </div>

        <div v-if="error" class="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-200">{{ error }}</div>

        <button type="submit" class="btn-primary w-full" :disabled="loading">
          <span v-if="loading">Sending...</span>
          <span v-else>Send RSVP 💌</span>
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
  { value: 'maybe', label: 'Maybe', icon: '🤔' },
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
