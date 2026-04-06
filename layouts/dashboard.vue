<template>
  <div class="min-h-screen flex bg-gray-50">
    <!-- Sidebar -->
    <aside class="w-64 bg-white shadow-sm flex flex-col fixed h-full z-40" :class="{ '-translate-x-full': !sidebarOpen, 'translate-x-0': sidebarOpen }" style="transition: transform 0.3s ease">
      <div class="p-6 border-b border-gray-100">
        <NuxtLink to="/dashboard" class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-romantic-gradient flex items-center justify-center">
            <span class="text-white text-lg">💍</span>
          </div>
          <div>
            <p class="font-serif font-semibold text-rose-800 text-sm">Wedding</p>
            <p class="font-serif font-semibold text-rose-800 text-sm">Invitation</p>
          </div>
        </NuxtLink>
      </div>

      <nav class="flex-1 py-4 px-3 overflow-y-auto">
        <p class="text-xs font-medium text-gray-400 uppercase tracking-wider px-4 mb-2">Menu</p>
        <NuxtLink v-for="item in navItems" :key="item.href" :to="item.href" class="sidebar-item mb-1" :class="{ active: route.path === item.href || route.path.startsWith(item.href + '/') }">
          <span class="text-lg">{{ item.icon }}</span>
          <span class="text-sm">{{ item.label }}</span>
        </NuxtLink>
      </nav>

      <!-- User area -->
      <div class="p-4 border-t border-gray-100">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-bold text-sm">
            {{ authStore.user?.name?.charAt(0)?.toUpperCase() }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-800 truncate">{{ authStore.user?.name }}</p>
            <p class="text-xs text-gray-400 truncate">{{ authStore.user?.email }}</p>
          </div>
          <button @click="handleLogout" class="text-gray-400 hover:text-red-500 transition-colors" title="Logout">
            <span>🚪</span>
          </button>
        </div>
      </div>
    </aside>

    <!-- Mobile overlay -->
    <div v-if="sidebarOpen && isMobile" @click="sidebarOpen = false" class="fixed inset-0 bg-black/20 z-30 lg:hidden" />

    <!-- Main content -->
    <div class="flex-1 flex flex-col min-h-screen" :class="sidebarOpen ? 'lg:ml-64' : ''">
      <!-- Top bar -->
      <header class="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4 sticky top-0 z-20">
        <button @click="sidebarOpen = !sidebarOpen" class="text-gray-500 hover:text-gray-700 lg:hidden">
          <span class="text-xl">☰</span>
        </button>
        <div class="flex-1">
          <h1 class="text-lg font-semibold text-gray-800">{{ pageTitle }}</h1>
        </div>
        <div class="flex items-center gap-3">
          <span class="badge badge-rose">{{ authStore.user?.plan }}</span>
          <NuxtLink to="/dashboard/profile" class="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-bold text-sm hover:bg-rose-200 transition-colors">
            {{ authStore.user?.name?.charAt(0)?.toUpperCase() }}
          </NuxtLink>
        </div>
      </header>

      <!-- Page slot -->
      <main class="flex-1 p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const route = useRoute()
const sidebarOpen = ref(true)
const isMobile = ref(false)

const navItems = [
  { href: '/dashboard', icon: '🏠', label: 'Dashboard' },
  { href: '/dashboard/invitations', icon: '💌', label: 'Invitations' },
  { href: '/dashboard/profile', icon: '👤', label: 'Profile' },
]

const pageTitle = computed(() => {
  const path = route.path
  if (path === '/dashboard') return 'Dashboard'
  if (path.startsWith('/dashboard/invitations')) return 'My Invitations'
  if (path.startsWith('/dashboard/profile')) return 'Profile'
  return 'Dashboard'
})

onMounted(async () => {
  if (!authStore.isAuthenticated) await authStore.fetchMe()
  isMobile.value = window.innerWidth < 1024
  if (isMobile.value) sidebarOpen.value = false
  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth < 1024
  })
})

async function handleLogout() {
  await authStore.logout()
  await navigateTo('/login')
}
</script>
