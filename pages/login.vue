<template>
  <div class="min-h-screen flex items-center justify-center romantic-bg p-4">
    <!-- Floating petals -->
    <div class="petal" style="left:10%;animation-duration:7s;animation-delay:0s">🌸</div>
    <div class="petal" style="left:30%;animation-duration:9s;animation-delay:2s">🌺</div>
    <div class="petal" style="left:60%;animation-duration:6s;animation-delay:1s">🌸</div>
    <div class="petal" style="left:80%;animation-duration:8s;animation-delay:3s">🌹</div>

    <div class="w-full max-w-md z-10">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="text-5xl mb-4">💍</div>
        <h1 class="font-script text-4xl gold-text">Wedding Invitation</h1>
        <p class="text-gray-500 text-sm mt-1">Sign in to your account</p>
      </div>

      <div class="glass rounded-3xl p-8 shadow-xl">
        <h2 class="text-2xl font-serif font-semibold text-rose-800 mb-6">Welcome back</h2>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="form-label">Email address</label>
            <input v-model="form.email" type="email" class="form-input" placeholder="you@example.com" required />
          </div>
          <div>
            <label class="form-label">Password</label>
            <input v-model="form.password" type="password" class="form-input" placeholder="••••••••" required />
          </div>

          <div v-if="error" class="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-200">
            {{ error }}
          </div>

          <button type="submit" class="btn-primary w-full mt-6 flex items-center justify-center gap-2" :disabled="loading">
            <span v-if="loading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
            <span>{{ loading ? 'Signing in...' : 'Sign In' }}</span>
          </button>
        </form>

        <div class="gold-divider mt-6" />

        <p class="text-center text-sm text-gray-500">
          Don't have an account?
          <NuxtLink to="/register" class="text-rose-500 font-medium hover:text-rose-600">Create one</NuxtLink>
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

const form = reactive({ email: '', password: '' })
const error = ref('')
const loading = ref(false)

onMounted(async () => {
  await authStore.fetchMe()
  if (authStore.isAuthenticated) {
    router.push(authStore.isAdmin ? '/admin' : '/dashboard')
  }
})

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    await authStore.login(form.email, form.password)
    router.push(authStore.isAdmin ? '/admin' : '/dashboard')
  } catch (e: unknown) {
    const err = e as { data?: { message?: string }; message?: string }
    error.value = err?.data?.message || err?.message || 'Login failed. Please try again.'
  } finally {
    loading.value = false
  }
}

useHead({ title: 'Sign In — Wedding Invitation' })
</script>
