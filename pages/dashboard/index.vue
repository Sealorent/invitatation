<template>
  <div class="space-y-6">
    <!-- Stats cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div v-for="stat in stats" :key="stat.label" class="dashboard-card">
        <div class="text-3xl mb-2">{{ stat.icon }}</div>
        <p class="text-2xl font-bold text-rose-700">{{ stat.value }}</p>
        <p class="text-sm text-gray-500">{{ stat.label }}</p>
      </div>
    </div>

    <!-- Quick actions -->
    <div class="dashboard-card">
      <h2 class="font-serif text-xl text-rose-800 mb-4">Quick Actions</h2>
      <div class="flex flex-wrap gap-3">
        <NuxtLink to="/dashboard/invitations/create" class="btn-primary text-sm">
          ✨ Create New Invitation
        </NuxtLink>
        <NuxtLink to="/dashboard/invitations" class="btn-outline text-sm">
          💌 My Invitations
        </NuxtLink>
      </div>
    </div>

    <!-- Recent invitations -->
    <div class="dashboard-card">
      <div class="flex items-center justify-between mb-4">
        <h2 class="font-serif text-xl text-rose-800">My Invitations</h2>
        <NuxtLink to="/dashboard/invitations" class="text-rose-500 text-sm hover:text-rose-700">View all →</NuxtLink>
      </div>

      <div v-if="loading" class="py-8 flex justify-center">
        <div class="loader" />
      </div>

      <div v-else-if="!invitations?.length" class="text-center py-10 text-gray-400">
        <div class="text-5xl mb-3">💌</div>
        <p class="font-medium">No invitations yet</p>
        <p class="text-sm mt-1">Create your first wedding invitation</p>
        <NuxtLink to="/dashboard/invitations/create" class="btn-primary inline-block mt-4 text-sm">
          Create Now
        </NuxtLink>
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="inv in invitations.slice(0, 5)"
          :key="inv.id"
          class="flex items-center gap-4 p-4 rounded-xl border border-rose-50 hover:bg-rose-50 transition-colors"
        >
          <div class="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center text-2xl flex-shrink-0">
            💍
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-medium text-gray-800 truncate">{{ inv.brideName }} &amp; {{ inv.groomName }}</p>
            <p class="text-xs text-gray-400">{{ formatDate(inv.weddingDate) }} · /{{ inv.slug }}</p>
          </div>
          <div class="flex items-center gap-2 flex-shrink-0">
            <span class="badge" :class="inv.isPublished ? 'badge-success' : 'badge-warning'">
              {{ inv.isPublished ? 'Published' : 'Draft' }}
            </span>
            <NuxtLink :to="`/dashboard/invitations/${inv.id}`" class="btn-primary text-xs px-3 py-1.5">
              Edit
            </NuxtLink>
            <a :href="`/${inv.slug}`" target="_blank" class="btn-outline text-xs px-3 py-1.5">View</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const loading = ref(true)
const invitations = ref<any[]>([])

const stats = computed(() => [
  { icon: '💌', label: 'Invitations', value: invitations.value.length },
  { icon: '👥', label: 'Total RSVPs', value: invitations.value.reduce((a, i) => a + (i._count?.rsvps || 0), 0) },
  { icon: '👀', label: 'Total Views', value: invitations.value.reduce((a, i) => a + (i._count?.analytics || 0), 0) },
  { icon: '💬', label: 'Wishes', value: invitations.value.reduce((a, i) => a + (i._count?.wishes || 0), 0) },
])

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

onMounted(async () => {
  try {
    invitations.value = await $fetch('/api/invitations')
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})

useHead({ title: 'Dashboard — Wedding Invitation' })
</script>
