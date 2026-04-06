<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between flex-wrap gap-3">
      <div class="flex items-center gap-3">
        <NuxtLink to="/dashboard/invitations" class="text-rose-400 hover:text-rose-600 text-sm">← Back</NuxtLink>
        <div>
          <h2 class="font-serif text-xl text-rose-800">
            {{ inv?.brideName }} &amp; {{ inv?.groomName }}
          </h2>
          <p class="text-xs text-gray-400">/{{ inv?.slug }}</p>
        </div>
      </div>
      <div class="flex gap-2">
        <a :href="`/${inv?.slug}`" target="_blank" class="btn-outline text-sm">👁 Preview</a>
        <button @click="save" :disabled="saving" class="btn-primary text-sm">
          {{ saving ? 'Saving...' : '💾 Save' }}
        </button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex gap-1 bg-rose-50 p-1 rounded-2xl flex-wrap">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="activeTab === tab.id ? 'bg-white shadow text-rose-700 font-medium' : 'text-gray-500 hover:text-gray-700'"
        class="flex-1 text-xs sm:text-sm px-3 py-2 rounded-xl transition-all"
      >
        {{ tab.icon }} {{ tab.label }}
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="py-16 flex justify-center"><div class="loader" /></div>

    <template v-else>
      <!-- TAB: General -->
      <div v-if="activeTab === 'general'" class="dashboard-card space-y-5">
        <h3 class="font-serif text-lg text-rose-700">Couple Information</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="form-label">Bride's Name</label>
            <input v-model="form.brideName" class="form-input" />
          </div>
          <div>
            <label class="form-label">Groom's Name</label>
            <input v-model="form.groomName" class="form-input" />
          </div>
          <div>
            <label class="form-label">Wedding Date</label>
            <input v-model="form.weddingDate" type="date" class="form-input" />
          </div>
          <div>
            <label class="form-label">Theme</label>
            <select v-model="form.theme" class="form-input">
              <option value="romantic_classic">💕 Romantic Classic</option>
              <option value="minimal">⬜ Minimal</option>
              <option value="luxury">✨ Luxury Gold</option>
              <option value="floral">🌸 Floral</option>
            </select>
          </div>
          <div>
            <label class="form-label">Cover Photo URL</label>
            <input v-model="form.coverPhoto" class="form-input" placeholder="https://..." />
          </div>
          <div>
            <label class="form-label">Background Music URL</label>
            <input v-model="form.musicUrl" class="form-input" placeholder="https://..." />
          </div>
        </div>

        <div class="flex items-center gap-3 pt-2">
          <label class="toggle-switch">
            <input v-model="form.isPublished" type="checkbox" />
            <span class="toggle-thumb" />
          </label>
          <span class="text-sm text-gray-600">{{ form.isPublished ? '🌐 Published' : '📝 Draft' }}</span>
        </div>

        <!-- Bride Profile -->
        <h3 class="font-serif text-lg text-rose-700 pt-4 border-t border-rose-100">Bride Profile</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label class="form-label">Full Name</label><input v-model="brideProfile.name" class="form-input" /></div>
          <div><label class="form-label">Photo URL</label><input v-model="brideProfile.photo" class="form-input" placeholder="https://..." /></div>
          <div><label class="form-label">Father's Name</label><input v-model="brideProfile.fatherName" class="form-input" /></div>
          <div><label class="form-label">Mother's Name</label><input v-model="brideProfile.motherName" class="form-input" /></div>
          <div><label class="form-label">Instagram</label><input v-model="brideProfile.instagram" class="form-input" placeholder="@username" /></div>
        </div>

        <!-- Groom Profile -->
        <h3 class="font-serif text-lg text-rose-700 pt-4 border-t border-rose-100">Groom Profile</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label class="form-label">Full Name</label><input v-model="groomProfile.name" class="form-input" /></div>
          <div><label class="form-label">Photo URL</label><input v-model="groomProfile.photo" class="form-input" placeholder="https://..." /></div>
          <div><label class="form-label">Father's Name</label><input v-model="groomProfile.fatherName" class="form-input" /></div>
          <div><label class="form-label">Mother's Name</label><input v-model="groomProfile.motherName" class="form-input" /></div>
          <div><label class="form-label">Instagram</label><input v-model="groomProfile.instagram" class="form-input" placeholder="@username" /></div>
        </div>

        <!-- Events -->
        <h3 class="font-serif text-lg text-rose-700 pt-4 border-t border-rose-100">Events</h3>
        <div v-for="(event, i) in events" :key="i" class="border border-rose-100 rounded-2xl p-4 space-y-3">
          <div class="flex justify-between">
            <span class="font-medium text-rose-700 text-sm">Event {{ i + 1 }}</span>
            <button @click="events.splice(i,1)" class="text-red-400 text-xs hover:text-red-600">Remove</button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div><label class="form-label">Event Name</label><input v-model="event.title" class="form-input" placeholder="Akad / Reception" /></div>
            <div><label class="form-label">Type</label>
              <select v-model="event.type" class="form-input">
                <option value="akad">Akad</option>
                <option value="reception">Reception</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div><label class="form-label">Date</label><input v-model="event.date" type="date" class="form-input" /></div>
            <div><label class="form-label">Time</label><input v-model="event.time" class="form-input" placeholder="09:00 WIB" /></div>
            <div><label class="form-label">Venue</label><input v-model="event.venue" class="form-input" /></div>
            <div><label class="form-label">Address</label><input v-model="event.address" class="form-input" /></div>
            <div class="md:col-span-2"><label class="form-label">Google Maps Link</label><input v-model="event.mapsLink" class="form-input" placeholder="https://maps.google.com/..." /></div>
          </div>
        </div>
        <button @click="events.push({ title:'', type:'reception', date:'', time:'', venue:'', address:'', mapsLink:'' })" class="btn-outline text-sm">+ Add Event</button>

        <!-- Bank Accounts -->
        <h3 class="font-serif text-lg text-rose-700 pt-4 border-t border-rose-100">Bank Accounts (Gift)</h3>
        <div v-for="(bank, i) in bankAccounts" :key="i" class="border border-rose-100 rounded-2xl p-4">
          <div class="flex justify-between mb-3">
            <span class="font-medium text-rose-700 text-sm">Account {{ i + 1 }}</span>
            <button @click="bankAccounts.splice(i,1)" class="text-red-400 text-xs hover:text-red-600">Remove</button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div><label class="form-label">Bank Name</label><input v-model="bank.bankName" class="form-input" placeholder="BCA" /></div>
            <div><label class="form-label">Account Number</label><input v-model="bank.accountNumber" class="form-input" /></div>
            <div><label class="form-label">Account Holder</label><input v-model="bank.accountHolder" class="form-input" /></div>
          </div>
        </div>
        <button @click="bankAccounts.push({ bankName:'', accountNumber:'', accountHolder:'' })" class="btn-outline text-sm">+ Add Bank Account</button>
      </div>

      <!-- TAB: Sections -->
      <div v-if="activeTab === 'sections'" class="dashboard-card space-y-4">
        <h3 class="font-serif text-lg text-rose-700">Manage Sections</h3>
        <p class="text-sm text-gray-500">Enable or disable sections and drag to reorder how they appear on your invitation.</p>

        <div class="space-y-2">
          <div
            v-for="(sec, i) in invSections"
            :key="sec.id"
            class="p-4 border rounded-2xl transition-colors space-y-4"
            :class="sec.enabled ? 'border-rose-200 bg-rose-50/50' : 'border-gray-200 bg-gray-50 opacity-60'"
          >
            <div class="flex items-center gap-3">
              <div class="flex flex-col gap-1">
                <button @click="moveSectionUp(i)" :disabled="i === 0" class="text-gray-400 hover:text-rose-500 disabled:opacity-20 text-xs">▲</button>
                <button @click="moveSectionDown(i)" :disabled="i === invSections.length - 1" class="text-gray-400 hover:text-rose-500 disabled:opacity-20 text-xs">▼</button>
              </div>
              <span class="text-xl w-8 text-center">{{ sectionIcon(sec.type) }}</span>
              <div class="flex-1">
                <p class="text-sm font-medium" :class="sec.enabled ? 'text-rose-800' : 'text-gray-500'">{{ sec.title }}</p>
                <p class="text-xs text-gray-400">{{ sec.type }}</p>
              </div>
              <label class="toggle-switch">
                <input v-model="sec.enabled" type="checkbox" />
                <span class="toggle-thumb" />
              </label>
            </div>

            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <p class="text-xs font-medium text-gray-600">Section info text (shown on invitation)</p>
                <button @click="addSectionFreeText(sec)" class="text-xs text-rose-600 hover:text-rose-700">+ Add text</button>
              </div>

              <div
                v-for="(freeText, textIdx) in sectionFreeTexts(sec)"
                :key="`${sec.id}-free-text-${textIdx}`"
                class="space-y-1"
              >
                <div class="flex items-center justify-between">
                  <label class="text-[11px] uppercase tracking-wide text-gray-500">Text {{ textIdx + 1 }}</label>
                  <button
                    v-if="sectionFreeTexts(sec).length > 1"
                    @click="removeSectionFreeText(sec, textIdx)"
                    class="text-[11px] text-red-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
                <ClientOnly>
                  <QuillInput
                    :model-value="freeText"
                    @update:model-value="(value) => updateSectionFreeText(sec, textIdx, value)"
                    placeholder="Write any additional information for this section..."
                  />
                  <template #fallback>
                    <textarea
                      :value="freeText"
                      rows="2"
                      class="form-input"
                      placeholder="Loading editor..."
                      @input="updateSectionFreeText(sec, textIdx, ($event.target as HTMLTextAreaElement).value)"
                    />
                  </template>
                </ClientOnly>
              </div>
            </div>
          </div>
        </div>

        <button @click="saveSections" :disabled="savingSections" class="btn-primary text-sm">
          {{ savingSections ? 'Saving...' : '💾 Save Section Order' }}
        </button>
        <p v-if="sectionsSaved" class="text-green-600 text-sm">✅ Sections updated!</p>
      </div>

      <!-- TAB: Gallery -->
      <div v-if="activeTab === 'gallery'" class="space-y-4">
        <div class="dashboard-card">
          <h3 class="font-serif text-lg text-rose-700 mb-4">Google Drive Sync</h3>
          <p class="text-sm text-gray-500 mb-4">Sync images and videos from your Google Drive folder automatically.</p>
          <button @click="syncDrive" :disabled="syncing" class="btn-gold text-sm">
            {{ syncing ? '⏳ Syncing...' : '☁️ Sync from Google Drive' }}
          </button>
          <p v-if="syncMsg" class="text-sm text-green-600 mt-3">✅ {{ syncMsg }}</p>
          <p v-if="syncError" class="text-sm text-red-600 mt-3">❌ {{ syncError }}</p>
        </div>

        <div class="dashboard-card">
          <h3 class="font-serif text-lg text-rose-700 mb-4">Add Media Manually</h3>
          <div class="flex gap-3 flex-wrap">
            <input v-model="newMedia.url" class="form-input flex-1" placeholder="Image/Video URL or YouTube link" />
            <select v-model="newMedia.type" class="form-input w-32">
              <option value="image">🖼 Image</option>
              <option value="video">🎬 Video</option>
              <option value="youtube">▶️ YouTube</option>
            </select>
            <input v-model="newMedia.caption" class="form-input flex-1" placeholder="Caption (optional)" />
            <button @click="addMedia" class="btn-primary text-sm">Add</button>
          </div>
        </div>

        <div class="dashboard-card">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-serif text-lg text-rose-700">Gallery ({{ galleryTotal }} items)</h3>
            <div class="flex gap-2">
              <input type="file" ref="fileInput" class="hidden" @change="onFileSelected" accept="image/*,video/*" />
              <button @click="fileInput?.click()" :disabled="uploading" class="btn-primary text-xs">
                {{ uploading ? 'Uploading...' : '📤 Upload to Drive' }}
              </button>
            </div>
          </div>
          
          <div v-if="isLoadingGallery" class="py-8 flex justify-center"><div class="loader-sm" /></div>
          <template v-else>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div v-for="item in galleryItems" :key="item.id" class="relative group rounded-xl overflow-hidden border border-rose-100">
                <img v-if="item.type === 'image'" :src="item.url" class="w-full h-28 object-cover" />
                <div v-else-if="item.type === 'video' || item.type === 'youtube'" class="w-full h-28 bg-gray-100 flex items-center justify-center text-3xl">
                  {{ item.type === 'youtube' ? '▶️' : '🎬' }}
                </div>
                <div class="p-2">
                  <p class="text-xs text-gray-500 truncate">{{ item.caption || item.url }}</p>
                </div>
                <button
                  @click="deleteGallery(item.id)"
                  class="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 text-white text-xs hidden group-hover:flex items-center justify-center"
                >✕</button>
              </div>
            </div>
            <div v-if="!galleryItems.length" class="text-center text-gray-400 py-8 text-sm">No gallery items yet. Sync from Drive or add manually.</div>
            
            <!-- Pagination -->
            <div v-if="galleryTotalPages > 1" class="flex items-center justify-center gap-4 mt-6">
              <button @click="changeGalleryPage(galleryPage - 1)" :disabled="galleryPage === 1" class="btn-outline text-xs px-3 py-1">← Prev</button>
              <span class="text-xs text-gray-500">Page {{ galleryPage }} of {{ galleryTotalPages }}</span>
              <button @click="changeGalleryPage(galleryPage + 1)" :disabled="galleryPage === galleryTotalPages" class="btn-outline text-xs px-3 py-1">Next →</button>
            </div>
          </template>
        </div>
      </div>

      <!-- TAB: Guests -->
      <div v-if="activeTab === 'guests'" class="space-y-4">
        <div class="dashboard-card">
          <h3 class="font-serif text-lg text-rose-700 mb-4">Add Guest</h3>
          <div class="flex gap-3 flex-wrap">
            <input v-model="newGuest.name" class="form-input flex-1" placeholder="Guest name" />
            <input v-model="newGuest.phone" class="form-input w-48" placeholder="Phone (optional)" />
            <button @click="addGuest" class="btn-primary text-sm">Add + QR</button>
          </div>
        </div>
        <div class="dashboard-card">
          <h3 class="font-serif text-lg text-rose-700 mb-4">Guest List ({{ guests.length }})</h3>
          <div class="space-y-3">
            <div v-for="g in guests" :key="g.id" class="flex items-center gap-4 p-3 border border-rose-50 rounded-xl">
              <div class="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-bold text-sm">
                {{ g.name.charAt(0).toUpperCase() }}
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium">{{ g.name }}</p>
                <p class="text-xs text-gray-400">{{ g.phone || 'No phone' }}</p>
              </div>
              <div class="flex items-center gap-2">
                <span v-if="g.checkedIn" class="badge badge-success">✅ Checked In</span>
                <a v-if="g.qrCode" :href="g.qrCode" download class="text-xs text-rose-500 hover:underline">QR ↓</a>
                <button @click="copyWaLink(g.name)" class="text-xs text-green-600 hover:underline">WhatsApp</button>
              </div>
            </div>
            <div v-if="!guests.length" class="text-center text-gray-400 py-8 text-sm">No guests yet.</div>
          </div>
        </div>
      </div>

      <!-- TAB: RSVP -->
      <div v-if="activeTab === 'rsvp'" class="dashboard-card">
        <h3 class="font-serif text-lg text-rose-700 mb-4">RSVP Responses</h3>
        <div class="grid grid-cols-3 gap-4 mb-6">
          <div class="text-center p-4 bg-green-50 rounded-xl">
            <p class="text-2xl font-bold text-green-600">{{ rsvpStats.yes }}</p>
            <p class="text-xs text-gray-500">Attending</p>
          </div>
          <div class="text-center p-4 bg-red-50 rounded-xl">
            <p class="text-2xl font-bold text-red-500">{{ rsvpStats.no }}</p>
            <p class="text-xs text-gray-500">Not Attending</p>
          </div>
          <div class="text-center p-4 bg-yellow-50 rounded-xl">
            <p class="text-2xl font-bold text-yellow-600">{{ rsvpStats.maybe }}</p>
            <p class="text-xs text-gray-500">Maybe</p>
          </div>
        </div>
        <div class="space-y-3">
          <div v-for="r in rsvps" :key="r.id" class="flex items-center gap-3 p-3 border border-rose-50 rounded-xl">
            <span class="text-xl">{{ r.attendance === 'yes' ? '✅' : r.attendance === 'no' ? '❌' : '🤔' }}</span>
            <div class="flex-1">
              <p class="text-sm font-medium">{{ r.guestName }}</p>
              <p class="text-xs text-gray-400">{{ r.message || 'No message' }} · {{ r.guestCount }} pax</p>
            </div>
            <p class="text-xs text-gray-400">{{ formatDate(r.createdAt) }}</p>
          </div>
          <div v-if="!rsvps.length" class="text-center text-gray-400 py-8 text-sm">No RSVPs yet.</div>
        </div>
      </div>

      <!-- TAB: Wishes -->
      <div v-if="activeTab === 'wishes'" class="dashboard-card">
        <h3 class="font-serif text-lg text-rose-700 mb-4">Guest Wishes ({{ wishes.length }})</h3>
        <div class="space-y-3">
          <div v-for="w in wishes" :key="w.id" class="flex gap-3 p-3 border border-rose-50 rounded-xl">
            <div class="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-bold text-sm flex-shrink-0">
              {{ w.name.charAt(0).toUpperCase() }}
            </div>
            <div>
              <p class="text-sm font-medium text-rose-700">{{ w.name }}</p>
              <p class="text-sm text-gray-600">{{ w.message }}</p>
              <p class="text-xs text-gray-400 mt-1">{{ formatDate(w.createdAt) }}</p>
            </div>
          </div>
          <div v-if="!wishes.length" class="text-center text-gray-400 py-8 text-sm">No wishes yet.</div>
        </div>
      </div>

      <!-- TAB: WhatsApp -->
      <div v-if="activeTab === 'whatsapp'" class="dashboard-card space-y-4">
        <h3 class="font-serif text-lg text-rose-700">WhatsApp Invitation Generator</h3>
        <p class="text-sm text-gray-500">Generate personalized WhatsApp messages for each guest.</p>
        <div>
          <label class="form-label">Guest Name (preview)</label>
          <input v-model="waGuest" class="form-input" placeholder="Guest name" />
        </div>
        <div class="p-4 bg-green-50 rounded-xl border border-green-100">
          <pre class="text-sm text-gray-700 whitespace-pre-wrap font-sans">{{ waMessage }}</pre>
        </div>
        <div class="flex gap-3">
          <button @click="copyWaMessage" class="btn-outline text-sm">{{ waCopied ? '✅ Copied!' : '📋 Copy Message' }}</button>
          <a :href="waLink" target="_blank" class="btn-primary text-sm">📱 Open WhatsApp</a>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import QuillInput from '~/components/QuillInput.client.vue'

definePageMeta({ layout: 'dashboard' })

const route = useRoute()
const invId = route.params.id as string

const loading = ref(true)
const saving = ref(false)
const syncing = ref(false)
const syncMsg = ref('')
const syncError = ref('')
const activeTab = ref('general')
const inv = ref<any>(null)

const tabs = [
  { id: 'general', label: 'General', icon: '📝' },
  { id: 'sections', label: 'Sections', icon: '🧩' },
  { id: 'gallery', label: 'Gallery', icon: '🖼️' },
  { id: 'guests', label: 'Guests', icon: '👥' },
  { id: 'rsvp', label: 'RSVP', icon: '✅' },
  { id: 'wishes', label: 'Wishes', icon: '📌' },
  { id: 'whatsapp', label: 'WhatsApp', icon: '📱' },
]

const form = reactive({
  brideName: '', groomName: '', weddingDate: '', theme: 'romantic_classic',
  coverPhoto: '', musicUrl: '', isPublished: false
})
const brideProfile = reactive({ name: '', photo: '', fatherName: '', motherName: '', instagram: '' })
const groomProfile = reactive({ name: '', photo: '', fatherName: '', motherName: '', instagram: '' })
const events = ref<any[]>([])
const bankAccounts = ref<any[]>([])
const invSections = ref<any[]>([])
const savingSections = ref(false)
const sectionsSaved = ref(false)

// Gallery State
const galleryItems = ref<any[]>([])
const galleryTotal = ref(0)
const galleryPage = ref(1)
const galleryTotalPages = ref(1)
const isLoadingGallery = ref(false)
const uploading = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const guests = ref<any[]>([])
const rsvps = ref<any[]>([])
const rsvpStats = ref({ yes: 0, no: 0, maybe: 0 })
const wishes = ref<any[]>([])

const newMedia = reactive({ url: '', type: 'image', caption: '' })
const newGuest = reactive({ name: '', phone: '' })
const waGuest = ref('Budi')
const waCopied = ref(false)

const waMessage = computed(() => {
  const url = typeof window !== 'undefined' ? `${window.location.origin}/${inv.value?.slug}?to=${encodeURIComponent(waGuest.value)}` : ''
  return `Kepada Yth.\nBapak/Ibu/Sdr/i ${waGuest.value}\n\nTanpa mengurangi rasa hormat, kami mengundang Anda untuk hadir dalam pernikahan kami:\n\n💍 ${inv.value?.groomName} & ${inv.value?.brideName}\n\nBuka undangan:\n${url}\n\nMerupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Sdr/i berkenan hadir. Terima kasih 🙏`
})
const waLink = computed(() => `https://api.whatsapp.com/send?text=${encodeURIComponent(waMessage.value)}`)

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

function copyWaLink(guestName: string) {
  if (!inv.value) return
  const url = `${window.location.origin}/${inv.value.slug}?to=${encodeURIComponent(guestName)}`
  navigator.clipboard.writeText(url).catch(() => {})
}

async function copyWaMessage() {
  await navigator.clipboard.writeText(waMessage.value).catch(() => {})
  waCopied.value = true
  setTimeout(() => { waCopied.value = false }, 2000)
}

async function save() {
  saving.value = true
  try {
    const weddingPayload = {
      ...form,
      weddingDate: form.weddingDate,
      brideProfile,
      groomProfile,
      events: events.value,
      bankAccounts: bankAccounts.value,
    }
    await $fetch(`/api/invitations/${invId}`, { method: 'PUT', body: weddingPayload })
  } catch (e) { console.error(e) }
  finally { saving.value = false }
}

const sectionIcons: Record<string, string> = {
  cover: '🖼️', bride_groom: '👰', countdown: '⏳', event_details: '📍',
  love_story: '💕', gallery: '📸', rsvp: '✅', guest_wishes: '📌',
  digital_gift: '🎁', live_stream: '📹', closing: '🌸'
}
function sectionIcon(type: string) { return sectionIcons[type] || '📄' }

function normalizeSectionSettings(raw: any): { freeTexts: string[]; [key: string]: any } {
  const parsed = (raw && typeof raw === 'object') ? { ...raw } : {}
  const freeTexts = Array.isArray(parsed.freeTexts)
    ? parsed.freeTexts.map((t: unknown) => String(t ?? ''))
    : ['']

  return {
    ...parsed,
    freeTexts: freeTexts.length ? freeTexts : ['']
  }
}

function sectionFreeTexts(section: any): string[] {
  return normalizeSectionSettings(section.settingsJson).freeTexts
}

function updateSectionFreeText(section: any, index: number, value: string) {
  const settings = normalizeSectionSettings(section.settingsJson)
  settings.freeTexts[index] = value
  section.settingsJson = settings
}

function addSectionFreeText(section: any) {
  const settings = normalizeSectionSettings(section.settingsJson)
  settings.freeTexts.push('')
  section.settingsJson = settings
}

function removeSectionFreeText(section: any, index: number) {
  const settings = normalizeSectionSettings(section.settingsJson)
  settings.freeTexts.splice(index, 1)
  if (!settings.freeTexts.length) settings.freeTexts.push('')
  section.settingsJson = settings
}

function moveSectionUp(i: number) {
  if (i <= 0) return
  const arr = invSections.value
  ;[arr[i], arr[i - 1]] = [arr[i - 1], arr[i]]
}
function moveSectionDown(i: number) {
  if (i >= invSections.value.length - 1) return
  const arr = invSections.value
  ;[arr[i], arr[i + 1]] = [arr[i + 1], arr[i]]
}

async function saveSections() {
  savingSections.value = true
  sectionsSaved.value = false
  try {
    const payload = invSections.value.map((s, i) => ({
      id: s.id, type: s.type, title: s.title,
      enabled: s.enabled, displayOrder: i,
      settingsJson: normalizeSectionSettings(s.settingsJson)
    }))
    await $fetch(`/api/sections/${invId}`, { method: 'PUT', body: payload })
    sectionsSaved.value = true
    setTimeout(() => { sectionsSaved.value = false }, 3000)
  } catch (e) { console.error(e) }
  finally { savingSections.value = false }
}

async function fetchGallery(page = 1) {
  isLoadingGallery.value = true
  try {
    const res = await $fetch<any>(`/api/gallery/${invId}`, { query: { page, limit: 12 } })
    galleryItems.value = res.items
    galleryTotal.value = res.total
    galleryPage.value = res.page
    galleryTotalPages.value = res.totalPages
  } catch (e) { console.error(e) }
  finally { isLoadingGallery.value = false }
}

function changeGalleryPage(page: number) {
  fetchGallery(page)
}

async function onFileSelected(event: Event) {
  const target = event.target as HTMLInputElement
  if (!target.files?.length) return
  
  const file = target.files[0]
  uploading.value = true
  
  const formData = new FormData()
  formData.append('file', file)
  formData.append('invitationId', invId)
  
  try {
    await $fetch('/api/drive/upload', {
      method: 'POST',
      body: formData
    })
    await fetchGallery(1) // Refresh gallery
  } catch (e) {
    console.error('Upload failed:', e)
  } finally {
    uploading.value = false
    target.value = ''
  }
}

async function syncDrive() {
  syncMsg.value = ''
  syncError.value = ''
  syncing.value = true
  try {
    const res = await $fetch<any>('/api/drive/sync', { method: 'POST', body: { invitationId: invId } })
    syncMsg.value = res.message
    await fetchGallery(1)
  } catch (e: any) {
    syncError.value = e?.data?.message || 'Sync failed. Check Drive credentials.'
  } finally { syncing.value = false }
}

async function addMedia() {
  if (!newMedia.url) return
  await $fetch<any>('/api/gallery', {
    method: 'POST',
    body: { invitationId: invId, ...newMedia }
  })
  await fetchGallery(1)
  newMedia.url = ''
  newMedia.caption = ''
}

async function deleteGallery(id: string) {
  await $fetch(`/api/gallery/${id}`, { method: 'DELETE' })
  await fetchGallery(galleryPage.value)
}

async function addGuest() {
  if (!newGuest.name) return
  const g = await $fetch<any>('/api/guests', {
    method: 'POST',
    body: { invitationId: invId, ...newGuest }
  })
  guests.value.unshift(g)
  newGuest.name = ''
  newGuest.phone = ''
}

onMounted(async () => {
  try {
    const data = await $fetch<any>(`/api/invitations/${invId}`)
    inv.value = data
    form.brideName = data.brideName
    form.groomName = data.groomName
    form.weddingDate = data.weddingDate?.split('T')[0] || ''
    form.theme = data.theme
    form.coverPhoto = data.coverPhoto || ''
    form.musicUrl = data.musicUrl || ''
    form.isPublished = data.isPublished

    if (data.brideProfile) Object.assign(brideProfile, data.brideProfile)
    if (data.groomProfile) Object.assign(groomProfile, data.groomProfile)
    events.value = (data.events || []).map((e: any) => ({ ...e, date: e.date?.split('T')[0] }))
    bankAccounts.value = data.bankAccounts || []
    invSections.value = (data.sections || [])
      .map((s: any) => ({
        ...s,
        settingsJson: (() => {
          try {
            return normalizeSectionSettings(JSON.parse(s.settingsJson || '{}'))
          } catch {
            return normalizeSectionSettings({})
          }
        })()
      }))
      .sort((a: any, b: any) => a.displayOrder - b.displayOrder)

    // Load gallery, guests, rsvps, wishes
    const [gsts, rsvpData, wshs] = await Promise.all([
      $fetch<any[]>(`/api/guests/${invId}`).catch(() => []),
      $fetch<any>(`/api/rsvp/${invId}`).catch(() => ({ rsvps: [], stats: {} })),
      $fetch<any[]>(`/api/wishes/${invId}`).catch(() => []),
    ])
    await fetchGallery(1)
    guests.value = gsts
    rsvps.value = rsvpData.rsvps || []
    rsvpStats.value = rsvpData.stats || { yes: 0, no: 0, maybe: 0 }
    wishes.value = wshs
  } finally { loading.value = false }
})

useHead({ title: `Edit Invitation — Wedding Invitation` })
</script>
