<template>
  <div class="max-w-xl mx-auto space-y-6">
    <h2 class="font-serif text-2xl text-rose-800">My Profile</h2>

    <div class="dashboard-card space-y-5">
      <h3 class="font-serif text-lg text-rose-700">Account Information</h3>
      <form @submit.prevent="saveProfile" class="space-y-4">
        <div>
          <label class="form-label">Full Name</label>
          <input v-model="form.name" class="form-input" />
        </div>
        <div>
          <label class="form-label">Email</label>
          <input v-model="form.email" type="email" class="form-input" />
        </div>
        <div>
          <label class="form-label">Phone</label>
          <input v-model="form.phone" class="form-input" placeholder="+62..." />
        </div>

        <div v-if="profileSaved" class="text-green-600 text-sm">✅ Profile updated successfully!</div>
        <div v-if="profileError" class="text-red-600 text-sm">❌ {{ profileError }}</div>

        <button type="submit" class="btn-primary" :disabled="profileLoading">
          {{ profileLoading ? 'Saving...' : 'Save Profile' }}
        </button>
      </form>
    </div>

    <div class="dashboard-card space-y-5">
      <h3 class="font-serif text-lg text-rose-700">Change Password</h3>
      <form @submit.prevent="changePassword" class="space-y-4">
        <div>
          <label class="form-label">Current Password</label>
          <input v-model="passForm.currentPassword" type="password" class="form-input" />
        </div>
        <div>
          <label class="form-label">New Password</label>
          <input v-model="passForm.newPassword" type="password" class="form-input" minlength="8" />
        </div>

        <div v-if="passSaved" class="text-green-600 text-sm">✅ Password changed!</div>
        <div v-if="passError" class="text-red-600 text-sm">❌ {{ passError }}</div>

        <button type="submit" class="btn-outline" :disabled="passLoading">
          {{ passLoading ? 'Changing...' : 'Change Password' }}
        </button>
      </form>
    </div>

    <div class="dashboard-card">
      <h3 class="font-serif text-lg text-rose-700 mb-3">Account</h3>
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-600">Plan: <span class="font-semibold text-rose-700">{{ authStore.user?.plan }}</span></p>
        </div>
        <button @click="handleLogout" class="text-red-400 hover:text-red-600 text-sm">Sign out 🚪</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

definePageMeta({ layout: 'dashboard' })

const authStore = useAuthStore()
const router = useRouter()

const form = reactive({
  name: authStore.user?.name || '',
  email: authStore.user?.email || '',
  phone: (authStore.user?.phone as string) || ''
})

const passForm = reactive({ currentPassword: '', newPassword: '' })
const profileSaved = ref(false)
const profileError = ref('')
const profileLoading = ref(false)
const passSaved = ref(false)
const passError = ref('')
const passLoading = ref(false)

async function saveProfile() {
  profileError.value = ''
  profileLoading.value = true
  try {
    await authStore.updateProfile({ name: form.name, email: form.email, phone: form.phone })
    profileSaved.value = true
    setTimeout(() => { profileSaved.value = false }, 3000)
  } catch (e: any) {
    profileError.value = e?.data?.message || 'Failed to update profile'
  } finally {
    profileLoading.value = false
  }
}

async function changePassword() {
  passError.value = ''
  passLoading.value = true
  try {
    await authStore.updateProfile({
      currentPassword: passForm.currentPassword,
      newPassword: passForm.newPassword
    })
    passSaved.value = true
    passForm.currentPassword = ''
    passForm.newPassword = ''
    setTimeout(() => { passSaved.value = false }, 3000)
  } catch (e: any) {
    passError.value = e?.data?.message || 'Failed to change password'
  } finally {
    passLoading.value = false
  }
}

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}

useHead({ title: 'Profile — Wedding Invitation' })
</script>
