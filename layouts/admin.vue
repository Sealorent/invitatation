<template>
  <div class="min-h-screen flex bg-gray-900">
    <aside class="w-64 bg-gray-800 flex flex-col fixed h-full z-40">
      <div class="p-6 border-b border-gray-700">
        <NuxtLink to="/admin" class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center">
            <span class="text-white text-lg">⚙️</span>
          </div>
          <div>
            <p class="font-semibold text-white text-sm">Admin Panel</p>
            <p class="text-gray-400 text-xs">Wedding Invitation</p>
          </div>
        </NuxtLink>
      </div>
      <nav class="flex-1 py-4 px-3">
        <NuxtLink v-for="item in navItems" :key="item.href" :to="item.href"
          class="flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-colors text-gray-300 hover:bg-gray-700 hover:text-white"
          :class="{ 'bg-gray-700 text-white font-medium': route.path === item.href }">
          <span>{{ item.icon }}</span>
          <span class="text-sm">{{ item.label }}</span>
        </NuxtLink>
      </nav>
      <div class="p-4 border-t border-gray-700">
        <button @click="handleLogout" class="text-gray-400 hover:text-red-400 text-sm flex items-center gap-2 w-full px-4 py-2">
          🚪 <span>Logout</span>
        </button>
      </div>
    </aside>
    <div class="flex-1 ml-64 min-h-screen">
      <header class="bg-gray-800 border-b border-gray-700 px-6 py-4 sticky top-0 z-20">
        <h1 class="text-lg font-semibold text-white">{{ pageTitle }}</h1>
      </header>
      <main class="p-6"><slot /></main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
const authStore = useAuthStore()
const route = useRoute()
const navItems = [
  { href: '/admin', icon: '📊', label: 'Dashboard' },
  { href: '/admin/users', icon: '👥', label: 'User Management' },
  { href: '/admin/sections', icon: '🧩', label: 'Section Templates' },
]
const pageTitle = computed(() => {
  if (route.path === '/admin') return 'Admin Dashboard'
  if (route.path === '/admin/users') return 'User Management'
  if (route.path === '/admin/sections') return 'Section Templates'
  return 'Admin'
})
async function handleLogout() {
  await authStore.logout()
  await navigateTo('/login')
}
</script>
