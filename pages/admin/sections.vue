<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-semibold text-white">Section Templates</h2>
        <p class="text-gray-400 text-sm mt-1">Manage available sections for all invitations. New invitations will use these as defaults.</p>
      </div>
    </div>

    <div v-if="loading" class="py-16 flex justify-center"><div class="loader" /></div>

    <template v-else>
      <!-- Section list -->
      <div class="space-y-3">
        <div
          v-for="(sec, i) in sections"
          :key="sec.id"
          class="bg-gray-800 rounded-2xl border border-gray-700 p-5 flex items-center gap-4"
        >
          <!-- Order -->
          <div class="flex flex-col gap-1">
            <button @click="moveUp(i)" :disabled="i === 0" class="text-gray-500 hover:text-white disabled:opacity-20 text-xs">▲</button>
            <span class="text-gray-500 text-xs text-center">{{ i }}</span>
            <button @click="moveDown(i)" :disabled="i === sections.length - 1" class="text-gray-500 hover:text-white disabled:opacity-20 text-xs">▼</button>
          </div>

          <!-- Icon -->
          <div class="text-3xl w-10 text-center">{{ sec.icon }}</div>

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <input v-model="sec.title" class="bg-transparent text-white font-medium text-sm border-b border-transparent hover:border-gray-600 focus:border-rose-400 outline-none w-48" />
              <span class="text-gray-500 text-xs font-mono">{{ sec.type }}</span>
            </div>
            <input v-model="sec.description" class="bg-transparent text-gray-400 text-xs mt-1 border-b border-transparent hover:border-gray-600 focus:border-rose-400 outline-none w-full" placeholder="Description..." />
          </div>

          <!-- Icon edit -->
          <input v-model="sec.icon" class="bg-gray-700 text-white text-center w-12 h-10 rounded-lg text-xl border border-gray-600" />

          <!-- Default enabled toggle -->
          <div class="flex flex-col items-center gap-1">
            <label class="toggle-switch">
              <input v-model="sec.defaultEnabled" type="checkbox" />
              <span class="toggle-thumb" />
            </label>
            <span class="text-gray-500 text-[10px]">Default ON</span>
          </div>

          <!-- Active toggle -->
          <div class="flex flex-col items-center gap-1">
            <label class="toggle-switch">
              <input v-model="sec.isActive" type="checkbox" />
              <span class="toggle-thumb" />
            </label>
            <span class="text-gray-500 text-[10px]">Active</span>
          </div>

          <!-- Delete -->
          <button @click="deleteSection(sec.id, i)" class="text-red-400 hover:text-red-300 text-sm px-2">🗑️</button>
        </div>
      </div>

      <!-- Save order button -->
      <div class="flex gap-3">
        <button @click="saveAll" :disabled="saving" class="btn-primary text-sm">
          {{ saving ? 'Saving...' : '💾 Save All Changes' }}
        </button>
      </div>

      <!-- Add new section -->
      <div class="bg-gray-800 rounded-2xl border border-gray-700 p-6">
        <h3 class="text-white font-medium mb-4">Add New Section Type</h3>
        <div class="flex gap-3 flex-wrap items-end">
          <div>
            <label class="text-gray-400 text-xs block mb-1">Type (snake_case)</label>
            <input v-model="newSec.type" class="bg-gray-700 text-white px-3 py-2 rounded-lg text-sm border border-gray-600 w-40" placeholder="e.g. music_player" />
          </div>
          <div>
            <label class="text-gray-400 text-xs block mb-1">Title</label>
            <input v-model="newSec.title" class="bg-gray-700 text-white px-3 py-2 rounded-lg text-sm border border-gray-600 w-40" placeholder="e.g. Music Player" />
          </div>
          <div>
            <label class="text-gray-400 text-xs block mb-1">Icon</label>
            <input v-model="newSec.icon" class="bg-gray-700 text-white px-3 py-2 rounded-lg text-sm border border-gray-600 w-16 text-center" placeholder="🎵" />
          </div>
          <div>
            <label class="text-gray-400 text-xs block mb-1">Description</label>
            <input v-model="newSec.description" class="bg-gray-700 text-white px-3 py-2 rounded-lg text-sm border border-gray-600 w-56" placeholder="Short description" />
          </div>
          <button @click="addSection" class="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium">+ Add</button>
        </div>
        <p v-if="addError" class="text-red-400 text-xs mt-2">{{ addError }}</p>
      </div>
    </template>

    <!-- Toast -->
    <div v-if="msg" class="fixed bottom-6 right-6 bg-green-500 text-white px-5 py-3 rounded-xl shadow-lg text-sm z-50">
      ✅ {{ msg }}
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const loading = ref(true)
const saving = ref(false)
const msg = ref('')
const addError = ref('')
const sections = ref<any[]>([])
const newSec = reactive({ type: '', title: '', icon: '📄', description: '' })

function showMsg(text: string) { msg.value = text; setTimeout(() => { msg.value = '' }, 2500) }

function moveUp(i: number) {
  if (i <= 0) return
  const arr = sections.value
  ;[arr[i], arr[i - 1]] = [arr[i - 1], arr[i]]
}
function moveDown(i: number) {
  if (i >= sections.value.length - 1) return
  const arr = sections.value
  ;[arr[i], arr[i + 1]] = [arr[i + 1], arr[i]]
}

async function saveAll() {
  saving.value = true
  try {
    for (let i = 0; i < sections.value.length; i++) {
      const s = sections.value[i]
      await $fetch(`/api/admin/sections/${s.id}`, {
        method: 'PUT',
        body: { title: s.title, icon: s.icon, description: s.description, defaultEnabled: s.defaultEnabled, isActive: s.isActive, displayOrder: i }
      })
    }
    showMsg('All sections saved!')
  } catch (e) { console.error(e) }
  finally { saving.value = false }
}

async function addSection() {
  addError.value = ''
  if (!newSec.type || !newSec.title) { addError.value = 'Type and title are required'; return }
  try {
    const created = await $fetch<any>('/api/admin/sections', {
      method: 'POST',
      body: { ...newSec, displayOrder: sections.value.length }
    })
    sections.value.push(created)
    newSec.type = ''; newSec.title = ''; newSec.icon = '📄'; newSec.description = ''
    showMsg('Section added!')
  } catch (e: any) { addError.value = e?.data?.message || 'Failed to add' }
}

async function deleteSection(id: string, i: number) {
  if (!confirm('Delete this section template? Existing invitations won\'t be affected.')) return
  await $fetch(`/api/admin/sections/${id}`, { method: 'DELETE' })
  sections.value.splice(i, 1)
  showMsg('Section deleted')
}

onMounted(async () => {
  try { sections.value = await $fetch('/api/admin/sections') }
  catch (e) { console.error(e) }
  finally { loading.value = false }
})

useHead({ title: 'Section Templates — Admin' })
</script>
