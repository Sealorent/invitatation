<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="font-serif text-2xl text-rose-800">My Invitations</h2>
        <p class="text-sm text-gray-500 mt-1">Manage and share your wedding invitations</p>
      </div>
      <NuxtLink to="/dashboard/invitations/create" class="btn-primary text-sm">
        ✨ New Invitation
      </NuxtLink>
    </div>

    <div v-if="loading" class="py-16 flex justify-center">
      <div class="loader" />
    </div>

    <div v-else-if="!invitations.length" class="dashboard-card text-center py-16">
      <div class="text-6xl mb-4">💌</div>
      <p class="font-serif text-xl text-rose-700 mb-2">No invitations yet</p>
      <p class="text-gray-400 text-sm mb-6">Create your first beautiful wedding invitation</p>
      <NuxtLink to="/dashboard/invitations/create" class="btn-primary inline-block">
        Create Your First Invitation
      </NuxtLink>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="inv in invitations"
        :key="inv.id"
        class="card-romantic"
      >
        <!-- Cover image -->
        <div class="relative h-40 bg-gradient-to-br from-rose-200 to-pink-300 overflow-hidden">
          <img v-if="inv.coverPhoto" :src="inv.coverPhoto" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-black/20 flex items-end p-4">
            <div>
              <p class="text-white font-script text-2xl drop-shadow">{{ inv.brideName }} &amp; {{ inv.groomName }}</p>
              <p class="text-white/80 text-xs">{{ formatDate(inv.weddingDate) }}</p>
            </div>
          </div>
          <div class="absolute top-3 right-3">
            <span class="badge" :class="inv.isPublished ? 'badge-success' : 'badge-warning'">
              {{ inv.isPublished ? 'Published' : 'Draft' }}
            </span>
          </div>
        </div>

        <!-- Info -->
        <div class="p-5">
          <div class="flex items-center gap-2 text-xs text-gray-500 mb-4">
            <span>🔗 /{{ inv.slug }}</span>
            <span>·</span>
            <span>👁 {{ inv._count?.analytics || 0 }} views</span>
            <span>·</span>
            <span>✅ {{ inv._count?.rsvps || 0 }} RSVPs</span>
          </div>

          <div class="flex gap-2 flex-wrap">
            <NuxtLink :to="`/dashboard/invitations/${inv.id}`" class="btn-primary text-xs flex-1 text-center">
              ✏️ Edit
            </NuxtLink>
            <a :href="`/${inv.slug}`" target="_blank" class="btn-outline text-xs px-4 py-2">
              👁 Preview
            </a>
            <button @click="copyLink(inv.slug)" class="btn-outline text-xs px-4 py-2">
              {{ copied === inv.slug ? '✅' : '🔗' }}
            </button>
            <button @click="copyInvitation(inv.id)" :disabled="copying === inv.id" class="btn-outline text-xs px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed">
              {{ copying === inv.id ? '⏳' : '📋' }} Copy
            </button>
            <button @click="deleteInvitation(inv.id)" class="text-red-400 hover:text-red-600 text-xs px-2 py-2 rounded-lg hover:bg-red-50 transition-colors">
              🗑️
            </button>
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
const copied = ref('')
const copying = ref<string | null>(null)

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

async function copyLink(slug: string) {
  await navigator.clipboard.writeText(`${window.location.origin}/${slug}`).catch(() => {})
  copied.value = slug
  setTimeout(() => { copied.value = '' }, 2000)
}

async function copyInvitation(id: string) {
  copying.value = id
  try {
    const duplicate = await $fetch(`/api/invitations/${id}/copy`, { method: 'POST' })
    invitations.value.unshift(duplicate)
    copying.value = null
  } catch (e) {
    console.error('Copy failed:', e)
    copying.value = null
  }
}

async function deleteInvitation(id: string) {
  if (!confirm('Delete this invitation? This cannot be undone.')) return
  await $fetch(`/api/invitations/${id}`, { method: 'DELETE' })
  invitations.value = invitations.value.filter(i => i.id !== id)
}

onMounted(async () => {
  try {
    invitations.value = await $fetch('/api/invitations')
  } finally {
    loading.value = false
  }
})

useHead({ title: 'My Invitations — Wedding Invitation' })
</script>
