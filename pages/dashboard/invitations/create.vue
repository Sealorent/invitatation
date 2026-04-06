<template>
  <div class="max-w-xl mx-auto">
    <div class="mb-6">
      <NuxtLink to="/dashboard/invitations" class="text-rose-500 text-sm hover:text-rose-700">← Back</NuxtLink>
      <h2 class="font-serif text-2xl text-rose-800 mt-2">Create New Invitation</h2>
    </div>

    <div class="dashboard-card">
      <form @submit.prevent="create" class="space-y-5">
        <div>
          <label class="form-label">Bride's Name *</label>
          <input v-model="form.brideName" type="text" class="form-input" placeholder="e.g. Yulia" required />
        </div>
        <div>
          <label class="form-label">Groom's Name *</label>
          <input v-model="form.groomName" type="text" class="form-input" placeholder="e.g. Ryan" required />
        </div>
        <div>
          <label class="form-label">Wedding Date *</label>
          <input v-model="form.weddingDate" type="date" class="form-input" required />
        </div>
        <div>
          <label class="form-label">Theme</label>
          <select v-model="form.theme" class="form-input">
            <option value="romantic_classic">💕 Romantic Classic</option>
            <option value="minimal">⬜ Minimal</option>
            <option value="luxury">✨ Luxury Gold</option>
            <option value="floral">🌸 Floral</option>
          </select>
        </div>

        <div v-if="error" class="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-200">
          {{ error }}
        </div>

        <button type="submit" class="btn-primary w-full" :disabled="loading">
          <span v-if="loading">Creating...</span>
          <span v-else">✨ Create Invitation</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const router = useRouter()
const form = reactive({ brideName: '', groomName: '', weddingDate: '', theme: 'romantic_classic' })
const loading = ref(false)
const error = ref('')

async function create() {
  error.value = ''
  loading.value = true
  try {
    const inv = await $fetch<{ id: string }>('/api/invitations', {
      method: 'POST',
      body: form
    })
    router.push(`/dashboard/invitations/${inv.id}`)
  } catch (e: any) {
    error.value = e?.data?.message || 'Failed to create invitation'
  } finally {
    loading.value = false
  }
}

useHead({ title: 'Create Invitation — Wedding Invitation' })
</script>
