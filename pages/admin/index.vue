<template>
  <div class="space-y-6">
    <div v-if="loading" class="py-16 flex justify-center"><div class="loader" /></div>
    <template v-else>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div v-for="s in statCards" :key="s.label" class="bg-gray-800 rounded-2xl p-5 border border-gray-700">
          <div class="text-3xl mb-2">{{ s.icon }}</div>
          <p class="text-2xl font-bold text-white">{{ s.value }}</p>
          <p class="text-sm text-gray-400">{{ s.label }}</p>
        </div>
      </div>

      <div class="bg-gray-800 rounded-2xl p-6 border border-gray-700">
        <h3 class="text-lg font-semibold text-white mb-4">Plan Breakdown</h3>
        <div class="flex gap-4 flex-wrap">
          <div v-for="p in stats.planBreakdown" :key="p.plan" class="flex items-center gap-2 bg-gray-700 px-4 py-2 rounded-xl">
            <span class="text-sm font-medium" :class="p.plan === 'pro' ? 'text-yellow-400' : 'text-gray-300'">
              {{ p.plan === 'pro' ? '⭐' : '🆓' }} {{ p.plan.toUpperCase() }}
            </span>
            <span class="text-white font-bold">{{ p._count }}</span>
          </div>
        </div>
      </div>

      <div class="bg-gray-800 rounded-2xl p-6 border border-gray-700">
        <h3 class="text-lg font-semibold text-white mb-4">Recent Users</h3>
        <div class="space-y-3">
          <div v-for="u in stats.recentUsers" :key="u.id" class="flex items-center gap-3 p-3 bg-gray-700 rounded-xl">
            <div class="w-9 h-9 rounded-full bg-rose-500 flex items-center justify-center text-white font-bold text-sm">
              {{ u.name.charAt(0).toUpperCase() }}
            </div>
            <div class="flex-1">
              <p class="text-white text-sm font-medium">{{ u.name }}</p>
              <p class="text-gray-400 text-xs">{{ u.email }}</p>
            </div>
            <span class="text-xs px-2 py-1 rounded-full" :class="u.plan === 'pro' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-600 text-gray-300'">
              {{ u.plan }}
            </span>
            <span v-if="u.role === 'admin'" class="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-400">admin</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })
const loading = ref(true)
const stats = ref<any>({})
const statCards = computed(() => [
  { icon: '👥', label: 'Total Users', value: stats.value.totalUsers || 0 },
  { icon: '💌', label: 'Invitations', value: stats.value.totalInvitations || 0 },
  { icon: '✅', label: 'RSVPs', value: stats.value.totalRsvps || 0 },
  { icon: '👀', label: 'Page Views', value: stats.value.totalViews || 0 },
])
onMounted(async () => {
  try { stats.value = await $fetch('/api/admin/stats') }
  catch (e) { console.error(e) }
  finally { loading.value = false }
})
useHead({ title: 'Admin Dashboard' })
</script>
