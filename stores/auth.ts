import { defineStore } from 'pinia'

interface User {
  id: string
  name: string
  email: string
  plan: string
  role: string
  avatar?: string | null
  phone?: string | null
  address?: string | null
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
    loading: false,
  }),

  getters: {
    isAuthenticated: (state): boolean => !!state.user,
    currentUser: (state) => state.user,
    isAdmin: (state): boolean => state.user?.role === 'admin',
  },

  actions: {
    async register(name: string, email: string, password: string) {
      this.loading = true
      try {
        const res = await $fetch<{ user: User; token: string }>('/api/auth/register', {
          method: 'POST',
          body: { name, email, password }
        })
        this.user = { ...res.user }
        this.token = res.token
        return res
      } finally {
        this.loading = false
      }
    },

    async login(email: string, password: string) {
      this.loading = true
      try {
        const res = await $fetch<{ user: User; token: string }>('/api/auth/login', {
          method: 'POST',
          body: { email, password }
        })
        this.user = { ...res.user }
        this.token = res.token
        return res
      } finally {
        this.loading = false
      }
    },

    async fetchMe() {
      try {
        const user = await $fetch<User>('/api/auth/me')
        this.user = { ...user }
      } catch {
        this.user = null
        this.token = null
      }
    },

    async logout() {
      await $fetch('/api/auth/logout', { method: 'POST' }).catch(() => {})
      this.user = null
      this.token = null
    },

    async updateProfile(data: Partial<User & { currentPassword?: string; newPassword?: string }>) {
      const updated = await $fetch<User>('/api/auth/profile', {
        method: 'PUT',
        body: data
      })
      this.user = { ...updated }
      return updated
    }
  }
})
