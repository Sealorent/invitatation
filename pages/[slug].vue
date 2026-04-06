<template>
  <div class="invitation-theme invitation-bg" :data-theme="activeTheme">
    <!-- Background music player (hidden) -->
    <audio ref="audioRef" loop preload="none" />

    <!-- Hidden YouTube player for YouTube music links -->
    <div
      v-if="youtubeMusicBaseEmbedUrl"
      class="fixed -left-[9999px] -top-[9999px] w-px h-px overflow-hidden opacity-0 pointer-events-none"
      aria-hidden="true"
    >
      <iframe
        id="youtube-music-player"
        :src="activeYoutubeMusicEmbedUrl"
        title="Background music"
        frameborder="0"
        allow="autoplay; encrypted-media; picture-in-picture"
      />
    </div>

    <!-- Music toggle button -->
    <button
      v-if="invitation?.musicUrl && invitationOpened"
      @click="toggleMusic"
      class="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-rose-500 text-white shadow-lg flex items-center justify-center hover:bg-rose-600 transition-colors animate-pulse-soft"
    >
      {{ musicPlaying ? '🔇' : '🎵' }}
    </button>

    <!-- Loading state -->
    <div v-if="pending" class="min-h-screen flex items-center justify-center romantic-bg">
      <div class="text-center">
        <div class="loader mx-auto mb-4" />
        <p class="font-script text-2xl text-rose-400">Loading invitation...</p>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="!invitation" class="min-h-screen flex items-center justify-center romantic-bg">
      <div class="text-center">
        <div class="text-6xl mb-4">💔</div>
        <h1 class="font-serif text-2xl text-rose-800 mb-2">Invitation Not Found</h1>
        <p class="text-gray-500">This invitation may have been removed or the link is invalid.</p>
      </div>
    </div>

    <!-- Invitation content -->
    <div v-else>
      <template v-for="section in enabledSections" :key="section.id">
        <div
          class="theme-section-wrap"
          :class="sectionLayoutClass(section.type)"
          :data-section-type="section.type"
          :data-section-variant="sectionVariant(section.type)"
        >
          <div
            v-if="(section.type === 'cover' || invitationOpened) && section.type !== 'bride_groom' && sectionFreeTexts(section).length"
            class="max-w-3xl mx-auto px-6 pt-4 space-y-2"
          >
            <div
              v-for="(freeText, textIdx) in sectionFreeTexts(section)"
              :key="`${section.id}-free-text-${textIdx}`"
              class="text-sm text-center text-gray-600 leading-relaxed [&_p]:mb-2 [&_ul]:list-disc [&_ul]:ml-5 [&_ol]:list-decimal [&_ol]:ml-5"
              v-html="freeText"
            />
          </div>

          <component
            v-if="section.type === 'cover' && invitation.brideName && invitation.groomName && invitation.weddingDate"
            :is="SectionsCover"
            class="theme-section"
            :invitation="{
              brideName: invitation.brideName,
              groomName: invitation.groomName,
              weddingDate: invitation.weddingDate,
              coverPhoto: invitation.coverPhoto || ''
            }"
            :guest-name="guestName"
            @open="onInvitationOpen"
          />

          <component
            v-else-if="section.type === 'bride_groom' && invitationOpened && invitation.brideName && invitation.groomName"
            :is="SectionsBrideGroom"
            class="theme-section"
            :invitation="{ brideName: invitation.brideName, groomName: invitation.groomName }"
            :bride-profile="invitation.brideProfile"
            :groom-profile="invitation.groomProfile"
            :free-texts="sectionFreeTexts(section)"
          />


          <component
            v-else-if="section.type === 'countdown' && invitationOpened && invitation.weddingDate"
            :is="SectionsCountdown"
            class="theme-section"
            :invitation="{ weddingDate: invitation.weddingDate }"
          />

          <component
            v-else-if="section.type === 'event_details' && invitationOpened && invitation.events?.length"
            :is="SectionsEventDetails"
            class="theme-section"
            :events="invitation.events"
          />

          <component
            v-else-if="section.type === 'love_story' && invitationOpened && invitation.loveStories?.length"
            :is="SectionsLoveStory"
            class="theme-section"
            :stories="invitation.loveStories"
          />

          <component
            v-else-if="section.type === 'gallery' && invitationOpened && invitation.gallery?.length"
            :is="SectionsGallery"
            class="theme-section"
            :gallery="invitation.gallery"
          />

          <component
            v-else-if="section.type === 'rsvp' && invitationOpened"
            :is="SectionsRsvp"
            class="theme-section"
            :invitation-id="invitation.id"
          />

          <component
            v-else-if="section.type === 'guest_wishes' && invitationOpened"
            :is="SectionsWishes"
            class="theme-section"
            :invitation-id="invitation.id"
            :wishes="invitation.wishes || []"
          />

          <component
            v-else-if="section.type === 'digital_gift' && invitationOpened && invitation.bankAccounts?.length"
            :is="SectionsGift"
            class="theme-section"
            :bank-accounts="invitation.bankAccounts"
          />

          <component
            v-else-if="section.type === 'live_stream' && invitationOpened && sectionSettings(section).youtubeUrl"
            :is="SectionsLiveStream"
            class="theme-section"
            :youtube-url="sectionSettings(section).youtubeUrl"
          />

          <component
            v-else-if="section.type === 'closing' && invitationOpened && invitation.brideName && invitation.groomName"
            :is="SectionsClosing"
            class="theme-section"
            :invitation="{ brideName: invitation.brideName, groomName: invitation.groomName, slug: invitation.slug }"
            :closing-message="sectionSettings(section).closingMessage"
            :couple-name="sectionSettings(section).coupleName"
          />

        </div>

      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import SectionsCover from '~/components/sections/Cover.vue'
import SectionsBrideGroom from '~/components/sections/BrideGroom.vue'
import SectionsCountdown from '~/components/sections/Countdown.vue'
import SectionsEventDetails from '~/components/sections/EventDetails.vue'
import SectionsLoveStory from '~/components/sections/LoveStory.vue'
import SectionsGallery from '~/components/sections/Gallery.vue'
import SectionsRsvp from '~/components/sections/Rsvp.vue'
import SectionsWishes from '~/components/sections/Wishes.vue'
import SectionsGift from '~/components/sections/Gift.vue'
import SectionsLiveStream from '~/components/sections/LiveStream.vue'
import SectionsClosing from '~/components/sections/Closing.vue'

definePageMeta({ layout: false })

const route = useRoute()
const slug = computed(() => route.params.slug as string)
const guestName = computed(() => (route.query.to as string) || '')

const { data: invitation, pending } = await useFetch<Record<string, any>>(
  () => `/api/public/${slug.value}`
)

// Track analytics view on mount
onMounted(async () => {
  if (invitation.value?.id) {
    $fetch('/api/analytics/view', {
      method: 'POST',
      body: { invitationId: invitation.value.id, visitor: { name: guestName.value } }
    }).catch(() => {})
  }
})

const invitationOpened = ref(false)
const audioRef = ref<HTMLAudioElement | null>(null)
const musicPlaying = ref(false)
const MUSIC_DEBUG = true

const themeProfiles = {
  romantic_classic: {
    sectionVariants: {
      gallery: 'masonry-soft',
      event_details: 'cards-classic',
      love_story: 'timeline-classic'
    },
    sectionLayouts: {
      gallery: 'standard'
    },
    sectionOrder: [] as string[]
  },
  minimal: {
    sectionVariants: {
      gallery: 'grid-clean',
      event_details: 'cards-minimal',
      countdown: 'compact'
    },
    sectionLayouts: {
      gallery: 'tight',
      event_details: 'spacious'
    },
    sectionOrder: [] as string[]
  },
  luxury: {
    sectionVariants: {
      bride_groom: 'editorial-portrait',
      gallery: 'editorial-offset',
      event_details: 'cards-luxury',
      closing: 'ceremony-grand'
    },
    sectionLayouts: {
      bride_groom: 'editorial',
      gallery: 'showcase',
      event_details: 'framed'
    },
    sectionOrder: [] as string[]
  },
  floral: {
    sectionVariants: {
      gallery: 'masonry-petals',
      event_details: 'cards-floral',
      wishes: 'notes-soft'
    },
    sectionLayouts: {
      gallery: 'floaty'
    },
    sectionOrder: [] as string[]
  }
} as const

type ThemeKey = keyof typeof themeProfiles

const activeTheme = computed<ThemeKey>(() => {
  const theme = String(invitation.value?.theme || 'romantic_classic')
  return theme in themeProfiles ? (theme as ThemeKey) : 'romantic_classic'
})

const themeStylesheetHref = computed(() => `/themes/${activeTheme.value}.css`)

const activeThemeProfile = computed(() => themeProfiles[activeTheme.value])

const enabledSections = computed(() => {
  if (!invitation.value?.sections) return []
  const baseSections = (invitation.value.sections as Array<Record<string, any>>)
    .filter((s) => s.enabled)
    .sort((a, b) => (a.displayOrder as number) - (b.displayOrder as number))

  const order = activeThemeProfile.value.sectionOrder
  if (!order.length) return baseSections

  const rank = new Map(order.map((type, index) => [type, index]))
  const fallbackRank = order.length + 1

  return [...baseSections].sort((a, b) => {
    const aRank = rank.get(String(a.type)) ?? fallbackRank
    const bRank = rank.get(String(b.type)) ?? fallbackRank
    if (aRank !== bRank) return aRank - bRank
    return (a.displayOrder as number) - (b.displayOrder as number)
  })
})

function sectionVariant(sectionType: string) {
  return activeThemeProfile.value.sectionVariants[sectionType as keyof typeof activeThemeProfile.value.sectionVariants] || 'default'
}

function sectionLayoutClass(sectionType: string) {
  const layout = activeThemeProfile.value.sectionLayouts[sectionType as keyof typeof activeThemeProfile.value.sectionLayouts]
  return layout ? `section-layout-${layout}` : ''
}

function sectionSettings(section: Record<string, any>): Record<string, any> {
  try { return JSON.parse(section.settingsJson || '{}') } catch { return {} }
}

function sectionFreeTexts(section: Record<string, any>): string[] {
  const settings = sectionSettings(section)
  const freeTexts = Array.isArray(settings.freeTexts) ? settings.freeTexts : []
  return freeTexts
    .map((t) => sanitizeFreeTextHtml(String(t ?? '')))
    .filter((html) => stripHtml(html).length > 0)
}

function sanitizeFreeTextHtml(html: string): string {
  return html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractYouTubeVideoId(url: string): string | null {
  const input = String(url || '').trim()
  if (!input) return null

  // Allow direct IDs as a fallback for advanced users
  if (/^[a-zA-Z0-9_-]{11}$/.test(input)) return input

  try {
    const normalized = /^https?:\/\//i.test(input) ? input : `https://${input}`
    const parsed = new URL(normalized)
    const host = parsed.hostname.replace(/^www\./i, '').toLowerCase()

    if (host === 'youtu.be') {
      const id = parsed.pathname.split('/').filter(Boolean)[0]
      return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null
    }

    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'music.youtube.com') {
      const vParam = parsed.searchParams.get('v')
      if (vParam && /^[a-zA-Z0-9_-]{11}$/.test(vParam)) return vParam

      const pathParts = parsed.pathname.split('/').filter(Boolean)
      const marker = pathParts[0]
      if ((marker === 'embed' || marker === 'shorts' || marker === 'live') && pathParts[1]) {
        const id = pathParts[1]
        return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null
      }
    }
  } catch {
    // Fall through to regex fallback below.
  }

  const regexMatch = input.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/))([a-zA-Z0-9_-]{11})/i)
  return regexMatch ? regexMatch[1] : null
}

const youtubeMusicVideoId = computed(() => extractYouTubeVideoId(String(invitation.value?.musicUrl || '')))
const isYoutubeMusic = computed(() => Boolean(youtubeMusicVideoId.value))
const youtubeMusicBaseEmbedUrl = computed(() => {
  const id = youtubeMusicVideoId.value
  if (!id) return ''
  return `https://www.youtube.com/embed/${id}?controls=0&loop=1&playlist=${id}&rel=0&modestbranding=1&playsinline=1`
})
const activeYoutubeMusicEmbedUrl = computed(() => {
  if (!isYoutubeMusic.value || !invitationOpened.value) return ''
  if (!musicPlaying.value) return ''
  const separator = youtubeMusicBaseEmbedUrl.value.includes('?') ? '&' : '?'
  return `${youtubeMusicBaseEmbedUrl.value}${separator}autoplay=1`
})

async function onInvitationOpen() {
  invitationOpened.value = true
  if (MUSIC_DEBUG) {
    console.log('[music] invitation opened', {
      musicUrl: invitation.value?.musicUrl || '',
      isYoutubeMusic: isYoutubeMusic.value,
      youtubeVideoId: youtubeMusicVideoId.value,
    })
  }

  if (isYoutubeMusic.value) {
    musicPlaying.value = true
    if (MUSIC_DEBUG) {
      console.log('[music] youtube music start request', {
        embedUrl: activeYoutubeMusicEmbedUrl.value,
      })
    }
    return
  }

  if (invitation.value?.musicUrl && audioRef.value) {
    audioRef.value.src = invitation.value.musicUrl as string
    const playPromise = audioRef.value.play()
    playPromise.then(() => {
      if (MUSIC_DEBUG) console.log('[music] audio play started')
    }).catch((error) => {
      console.error('[music] audio play failed', error)
    })
    musicPlaying.value = true
  }
}

function toggleMusic() {
  if (MUSIC_DEBUG) {
    console.log('[music] toggle clicked', {
      isYoutubeMusic: isYoutubeMusic.value,
      currentState: musicPlaying.value,
    })
  }

  if (isYoutubeMusic.value) {
    musicPlaying.value = !musicPlaying.value
    if (MUSIC_DEBUG) {
      console.log('[music] youtube state changed', {
        playing: musicPlaying.value,
        embedUrl: activeYoutubeMusicEmbedUrl.value,
      })
    }
    return
  }

  if (!audioRef.value) return
  if (musicPlaying.value) {
    audioRef.value.pause()
    musicPlaying.value = false
    if (MUSIC_DEBUG) console.log('[music] audio paused')
  } else {
    const playPromise = audioRef.value.play()
    playPromise.then(() => {
      if (MUSIC_DEBUG) console.log('[music] audio resumed')
    }).catch((error) => {
      console.error('[music] audio resume failed', error)
    })
    musicPlaying.value = true
  }
}

onMounted(() => {
  if (!audioRef.value) return

  const onAudioError = () => {
    const err = audioRef.value?.error
    console.error('[music] audio element error', {
      code: err?.code,
      message: err?.message,
      src: audioRef.value?.currentSrc || audioRef.value?.src,
    })
  }

  const onAudioPlaying = () => {
    if (MUSIC_DEBUG) {
      console.log('[music] audio playing event', {
        src: audioRef.value?.currentSrc || audioRef.value?.src,
      })
    }
  }

  const onAudioPause = () => {
    if (MUSIC_DEBUG) console.log('[music] audio pause event')
  }

  audioRef.value.addEventListener('error', onAudioError)
  audioRef.value.addEventListener('playing', onAudioPlaying)
  audioRef.value.addEventListener('pause', onAudioPause)

  onBeforeUnmount(() => {
    audioRef.value?.removeEventListener('error', onAudioError)
    audioRef.value?.removeEventListener('playing', onAudioPlaying)
    audioRef.value?.removeEventListener('pause', onAudioPause)
  })
})

watch(activeYoutubeMusicEmbedUrl, (url) => {
  if (!MUSIC_DEBUG) return
  console.log('[music] youtube embed url updated', url || '(empty)')
})

useHead(() => ({
  title: invitation.value
    ? `${invitation.value.brideName} & ${invitation.value.groomName} Wedding`
    : 'Wedding Invitation',
  meta: [
    { name: 'description', content: `You are invited to the wedding of ${invitation.value?.brideName} & ${invitation.value?.groomName}` },
    { property: 'og:title', content: `${invitation.value?.brideName} & ${invitation.value?.groomName} Wedding Invitation` },
    { property: 'og:image', content: (invitation.value?.coverPhoto as string) || '' },
  ],
  link: [
    { id: 'invitation-theme-style', rel: 'stylesheet', href: themeStylesheetHref.value }
  ]
}))
</script>
