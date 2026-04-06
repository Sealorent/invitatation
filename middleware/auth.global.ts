import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  // Public routes - no auth needed
  const publicPaths = ['/', '/login', '/register']
  if (publicPaths.includes(to.path)) return

  // Skip public invitation pages (slugs)
  if (!to.path.startsWith('/dashboard') && !to.path.startsWith('/admin')) return

  const authStore = useAuthStore()

  if (!authStore.isAuthenticated) {
    try { await authStore.fetchMe() } catch {}
  }

  if (!authStore.isAuthenticated) {
    return navigateTo('/login')
  }

  // Admin routes require admin role
  if (to.path.startsWith('/admin') && authStore.user?.role !== 'admin') {
    return navigateTo('/dashboard')
  }
})
