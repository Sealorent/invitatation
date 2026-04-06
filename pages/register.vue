<template>
  <div class="min-h-screen flex items-center justify-center romantic-bg p-4">
    <div class="petal" style="left:15%;animation-duration:8s">🌸</div>
    <div class="petal" style="left:45%;animation-duration:10s;animation-delay:1s">🌺</div>
    <div class="petal" style="left:75%;animation-duration:7s;animation-delay:2s">🌹</div>

    <div class="w-full max-w-md z-10">
      <div class="text-center mb-8">
        <div class="text-5xl mb-4">💍</div>
        <h1 class="font-script text-4xl gold-text">Wedding Invitation</h1>
        <p class="text-gray-500 text-sm mt-1">Create your beautiful invitation</p>
      </div>

      <div class="glass rounded-3xl p-8 shadow-xl">
        <h2 class="text-2xl font-serif font-semibold text-rose-800 mb-6">Get started</h2>

        <form @submit.prevent="handleRegister" class="space-y-4">
          <div>
            <label class="form-label">Full name</label>
            <input v-model="form.name" type="text" class="form-input" placeholder="Your name" required />
          </div>
          <div>
            <label class="form-label">Email address</label>
            <input v-model="form.email" type="email" class="form-input" placeholder="you@example.com" required />
          </div>
          <div>
            <label class="form-label">Password <span class="text-gray-400 text-xs">(min 8 chars)</span></label>
            <input v-model="form.password" type="password" class="form-input" placeholder="••••••••" minlength="8" required />
          </div>

          <div v-if="error" class="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-200">
            {{ error }}
          </div>

          <button type="submit" class="btn-primary w-full mt-6 flex items-center justify-center gap-2" :disabled="loading">
            <span v-if="loading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
            <span>{{ loading ? 'Creating account...' : 'Create Account' }}</span>
          </button>
        </form>

        <div class="gold-divider mt-6" />

        <p class="text-center text-sm text-gray-500">
          Already have an account?
          <NuxtLink to="/login" class="text-rose-500 font-medium hover:text-rose-600">Sign in</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

definePageMeta({ layout: false })

const authStore = useAuthStore()
const router = useRouter()
const form = reactive({ name: '', email: '', password: '' })
const error = ref('')
const loading = ref(false)

async function handleRegister() {
  error.value = ''
  loading.value = true
  try {
    await authStore.register(form.name, form.email, form.password)
    router.push('/dashboard')
  } catch (e: unknown) {
    const err = e as { data?: { message?: string }; message?: string }
    error.value = err?.data?.message || err?.message || 'Registration failed. Please try again.'
  } finally {
    loading.value = false
  }
}

useHead({ title: 'Register — Wedding Invitation' })
</script>
