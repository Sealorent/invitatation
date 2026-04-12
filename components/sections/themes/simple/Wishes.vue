<template>
  <div class="simple-wishes-section py-16 md:py-24">
    <div class="max-w-2xl mx-auto px-6" data-aos="fade-up">
      <!-- Section Header -->
      <div class="text-center mb-10">
        <h2 class="font-serif text-4xl md:text-5xl text-gray-800 mb-3">Wishes</h2>
        <p class="text-gray-500">Berikan ucapan harapan dan do'a kepada kedua mempelai</p>
      </div>

      <div class="bg-white shadow-xl rounded-lg p-6 md:p-8">
        <!-- RSVP Summary -->
        <div class="flex justify-center gap-4 mb-6">
          <div class="text-center bg-green-100 text-green-800 rounded-lg px-6 py-2">
            <div class="font-bold text-2xl">{{ rsvpSummary.attending }}</div>
            <div class="text-sm">Hadir</div>
          </div>
          <div class="text-center bg-red-100 text-red-800 rounded-lg px-6 py-2">
            <div class="font-bold text-2xl">{{ rsvpSummary.notAttending }}</div>
            <div class="text-sm">Tidak Hadir</div>
          </div>
        </div>

        <!-- Form -->
        <form @submit.prevent="submitForm" class="space-y-4 mb-8">
          <div>
            <input
              v-model="form.name"
              type="text"
              placeholder="Nama"
              class="form-input-simple"
              required
            >
          </div>
          <div>
            <textarea
              v-model="form.message"
              rows="3"
              placeholder="Ucapan"
              class="form-input-simple"
              required
            />
          </div>
          <div>
            <select v-model="form.attendance" class="form-input-simple" required>
              <option value="" disabled>Konfirmasi Kehadiran</option>
              <option value="yes">Hadir</option>
              <option value="no">Tidak Hadir</option>
            </select>
          </div>
          <button type="submit" :disabled="submitting" class="btn-simple-submit w-full">
            <span v-if="submitting">Mengirim...</span>
            <span v-else>Kirim</span>
          </button>
        </form>

        <!-- Comments -->
        <div>
          <h3 class="font-semibold text-lg text-gray-700 mb-4 border-b pb-2">
            {{ combinedList.length }} Comments
          </h3>
          <div v-if="!combinedList.length" class="text-center text-gray-500 py-6">
            Jadilah yang pertama mengirim ucapan.
          </div>
          <div v-else class="space-y-5 max-h-96 overflow-y-auto pr-2">
            <div v-for="item in combinedList" :key="item.id" class="flex items-start gap-3">
              <div class="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold" :class="item.type === 'rsvp' && item.attendance === 'yes' ? 'bg-green-500' : 'bg-gray-400'">
                {{ item.name.charAt(0).toUpperCase() }}
              </div>
              <div>
                <p class="font-bold text-gray-800">
                  {{ item.name }}
                  <span v-if="item.type === 'rsvp'">
                    <span v-if="item.attendance === 'yes'" class="text-green-600 text-xs">✓ Hadir</span>
                    <span v-else class="text-red-600 text-xs">✗ Tidak Hadir</span>
                  </span>
                </p>
                <p class="text-gray-600 text-sm mt-1">{{ item.message }}</p>
                <p class="text-xs text-gray-400 mt-2">{{ formatTimeAgo(item.createdAt) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import AOS from 'aos'
import { formatDistanceToNow } from 'date-fns'
import { id } from 'date-fns/locale'

interface Wish { id: string; name: string; message: string; createdAt: string; type: 'wish' }
interface Rsvp { id: string; guestName: string; message: string; attendance: string; createdAt: string; type: 'rsvp' }

const props = defineProps<{
  invitationId: string
  wishes: Wish[]
}>()

const form = reactive({ name: '', message: '', attendance: '' })
const submitting = ref(false)
const localWishes = ref<Wish[]>(props.wishes.map(w => ({ ...w, type: 'wish' })))
const rsvps = ref<Rsvp[]>([])

const rsvpSummary = computed(() => {
  return rsvps.value.reduce((acc, rsvp) => {
    if (rsvp.attendance === 'yes') acc.attending++
    if (rsvp.attendance === 'no') acc.notAttending++
    return acc
  }, { attending: 0, notAttending: 0 })
})

const combinedList = computed(() => {
  const mappedRsvps = rsvps.value.map(r => ({
    id: r.id,
    name: r.guestName,
    message: r.message,
    createdAt: r.createdAt,
    attendance: r.attendance,
    type: 'rsvp'
  }))
  const allItems = [...localWishes.value, ...mappedRsvps]
  return allItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
})

async function fetchRsvps() {
  try {
    const data = await $fetch<Rsvp[]>(`/api/rsvp/${props.invitationId}`)
    rsvps.value = data.map(r => ({ ...r, type: 'rsvp' }))
  } catch (error) {
    console.error('Failed to fetch RSVPs', error)
  }
}

async function submitForm() {
  submitting.value = true
  try {
    // Submit RSVP first
    const newRsvp = await $fetch<Rsvp>('/api/rsvp', {
      method: 'POST',
      body: {
        invitationId: props.invitationId,
        guestName: form.name,
        attendance: form.attendance,
        message: form.message
      }
    })
    rsvps.value.unshift({ ...newRsvp, type: 'rsvp' })

    // Also submit as a wish if there is a message
    if (form.message.trim()) {
      const newWish = await $fetch<Wish>('/api/wishes', {
        method: 'POST',
        body: {
          invitationId: props.invitationId,
          name: form.name,
          message: form.message
        }
      })
      localWishes.value.unshift({ ...newWish, type: 'wish' })
    }

    form.name = ''
    form.message = ''
    form.attendance = ''
  } catch (error) {
    console.error('Error submitting form:', error)
  } finally {
    submitting.value = false
  }
}

function formatTimeAgo(date: string) {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: id })
}

onMounted(() => {
  fetchRsvps()
  if (process.client) {
    AOS.init({ duration: 800, once: true })
  }
})
</script>

<style scoped lang="postcss">
.simple-wishes-section {
  background-color: #f7fafc;
  background-image:
    radial-gradient(circle at 15% 20%, #e2e8f0 0%, transparent 30%),
    radial-gradient(circle at 85% 80%, #e2e8f0 0%, transparent 25%);
}

.form-input-simple {
  @apply w-full bg-gray-100 border border-gray-300 rounded-md px-4 py-2.5 text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200;
}

.btn-simple-submit {
  @apply w-full bg-gray-800 text-white font-semibold py-2.5 px-4 rounded-md transition hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800;
}
</style>

