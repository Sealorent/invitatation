<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold text-white">All Users</h2>
      <span class="text-gray-400 text-sm">{{ users.length }} users</span>
    </div>

    <div v-if="loading" class="py-16 flex justify-center"><div class="loader" /></div>

    <div v-else class="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
      <table class="w-full text-left">
        <thead class="bg-gray-700 text-gray-300 text-xs uppercase">
          <tr>
            <th class="px-5 py-3">User</th>
            <th class="px-5 py-3">Plan</th>
            <th class="px-5 py-3">Role</th>
            <th class="px-5 py-3">Invitations</th>
            <th class="px-5 py-3">Joined</th>
            <th class="px-5 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in users" :key="u.id" class="border-t border-gray-700 hover:bg-gray-750">
            <td class="px-5 py-4">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center text-white text-sm font-bold">
                  {{ u.name.charAt(0).toUpperCase() }}
                </div>
                <div>
                  <p class="text-white text-sm font-medium">{{ u.name }}</p>
                  <p class="text-gray-400 text-xs">{{ u.email }}</p>
                </div>
              </div>
            </td>
            <td class="px-5 py-4">
              <select
                :value="u.plan"
                @change="updateUser(u.id, 'plan', ($event.target as HTMLSelectElement).value)"
                class="bg-gray-700 text-white text-xs px-3 py-1.5 rounded-lg border border-gray-600 cursor-pointer"
              >
                <option value="free">🆓 Free</option>
                <option value="pro">⭐ Pro</option>
              </select>
            </td>
            <td class="px-5 py-4">
              <select
                :value="u.role"
                @change="updateUser(u.id, 'role', ($event.target as HTMLSelectElement).value)"
                class="bg-gray-700 text-white text-xs px-3 py-1.5 rounded-lg border border-gray-600 cursor-pointer"
              >
                <option value="user">👤 User</option>
                <option value="admin">⚙️ Admin</option>
              </select>
            </td>
            <td class="px-5 py-4">
              <span class="text-white text-sm">{{ u._count?.invitations || 0 }}</span>
            </td>
            <td class="px-5 py-4">
              <span class="text-gray-400 text-xs">{{ formatDate(u.createdAt) }}</span>
            </td>
            <td class="px-5 py-4">
              <button
                @click="deleteUser(u.id, u.name)"
                class="text-red-400 hover:text-red-300 text-xs px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
              >
                🗑️ Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="msg" class="fixed bottom-6 right-6 bg-green-500 text-white px-5 py-3 rounded-xl shadow-lg text-sm z-50">
      ✅ {{ msg }}
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const loading = ref(true)
const users = ref<any[]>([])
const msg = ref('')

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function showMsg(text: string) {
  msg.value = text
  setTimeout(() => { msg.value = '' }, 2500)
}

async function updateUser(id: string, field: string, value: string) {
  try {
    const updated = await $fetch<any>(`/api/admin/users/${id}`, {
      method: 'PUT',
      body: { [field]: value }
    })
    const idx = users.value.findIndex(u => u.id === id)
    if (idx !== -1) users.value[idx] = updated
    showMsg(`Updated ${field} to "${value}"`)
  } catch (e: any) {
    showMsg(e?.data?.message || 'Update failed')
  }
}

async function deleteUser(id: string, name: string) {
  if (!confirm(`Delete user "${name}"? This will delete all their invitations too.`)) return
  try {
    await $fetch(`/api/admin/users/${id}`, { method: 'DELETE' })
    users.value = users.value.filter(u => u.id !== id)
    showMsg(`Deleted user "${name}"`)
  } catch (e: any) {
    showMsg(e?.data?.message || 'Delete failed')
  }
}

onMounted(async () => {
  try { users.value = await $fetch('/api/admin/users') }
  catch (e) { console.error(e) }
  finally { loading.value = false }
})

useHead({ title: 'User Management — Admin' })
</script>
