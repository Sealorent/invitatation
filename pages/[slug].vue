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
        ref="youtubeIframeRef"
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
      <!-- Debug info for blank page -->
      <div v-if="!renderedSections.length && invitation" class="min-h-screen flex items-center justify-center bg-red-50 p-6">
        <div class="max-w-2xl bg-white p-8 rounded-lg shadow-lg">
          <h2 class="text-2xl font-bold text-red-600 mb-6">Debug: No Sections Rendered</h2>
          <div class="space-y-4 text-gray-700 font-mono text-sm">
            <p><strong>Invitation:</strong> {{ invitation?.id ? '✓ Loaded' : '✗ Missing' }}</p>
            <p><strong>Theme:</strong> {{ activeTheme }}</p>
            <p><strong>Invitation Opened:</strong> {{ invitationOpened }}</p>
            <p><strong>Enabled Sections:</strong> {{ enabledSections.length }}</p>
            <p><strong>Rendered Sections:</strong> {{ renderedSections.length }}</p>
            <div v-if="enabledSections.length" class="mt-4 pt-4 border-t">
              <p class="font-bold mb-2">Enabled sections:</p>
              <div v-for="section in enabledSections" :key="section.id" class="text-xs pl-4 py-1">
                - {{ section.type }} ({{ sectionRenderers[section.type] ? 'has renderer' : 'no renderer' }})
              </div>
            </div>
          </div>
          <button
            @click="() => { console.log('Sections:', enabledSections); console.log('Rendered:', renderedSections) }"
            class="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Log Details to Console
          </button>
        </div>
      </div>

      <template v-for="item in renderedSections" :key="item.section.id">
        <div
          class="theme-section-wrap"
          :class="sectionLayoutClass(item.section.type)"
          :data-section-type="item.section.type"
          :data-section-variant="sectionVariant(item.section.type)"
        >
          <!-- <div
            v-if="shouldShowSectionFreeTexts(item.section)"
            class="max-w-3xl mx-auto px-6 pt-4 space-y-2"
          >
            <div
              v-for="(freeText, textIdx) in sectionFreeTexts(item.section)"
              :key="`${item.section.id}-free-text-${textIdx}`"
              class="text-sm text-center text-gray-600 leading-relaxed [&_p]:mb-2 [&_ul]:list-disc [&_ul]:ml-5 [&_ol]:list-decimal [&_ol]:ml-5"
              v-html="freeText"
            />
          </div> -->

          <component
            v-if="item.renderer"
            :is="item.renderer.component"
            class="theme-section"
            v-bind="item.renderer.props"
            @error="(err) => console.error(`Component error for ${item.section.type}:`, err)"
          />

          <div v-else-if="item.isFallback" class="theme-section max-w-4xl mx-auto px-6 py-16 text-center">
            <p class="text-xs uppercase tracking-[0.35em] text-rose-300 mb-3">
              {{ item.section.title || item.section.type.replace(/_/g, ' ') }}
            </p>
            <h2 class="font-serif text-3xl font-semibold text-rose-800 mb-4">
              {{ item.section.title || 'Custom Section' }}
            </h2>
            <div class="gold-divider mx-auto" />
            <!-- <div
              v-if="sectionFreeTexts(item.section).length"
              class="mt-6 space-y-2 text-sm text-gray-600 leading-relaxed [&_p]:mb-2 [&_ul]:list-disc [&_ul]:ml-5 [&_ol]:list-decimal [&_ol]:ml-5"
            >
              <div
                v-for="(freeText, textIdx) in sectionFreeTexts(item.section)"
                :key="`${item.section.id}-fallback-free-text-${textIdx}`"
                v-html="freeText"
              />
            </div> -->
          </div>

        </div>

      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
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
import { getInvitationThemeProfile, resolveInvitationTheme, sortSectionsForTheme } from '~/utils/invitation-theme-profiles'

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
const youtubeIframeRef = ref<HTMLIFrameElement | null>(null)
const musicPlaying = ref(false)
const MUSIC_DEBUG = true

type SectionRecord = Record<string, any> & {
  id: string
  type: string
  title?: string
  settingsJson?: string | null
  displayOrder?: number
}

type SectionRenderer = {
  component: Component
  props: Record<string, any>
}

const builtInSectionComponentNames: Record<string, string> = {
  cover: 'Cover',
  bride_groom: 'BrideGroom',
  countdown: 'Countdown',
  event_details: 'EventDetails',
  love_story: 'LoveStory',
  gallery: 'Gallery',
  rsvp: 'Rsvp',
  guest_wishes: 'Wishes',
  digital_gift: 'Gift',
  live_stream: 'LiveStream',
  closing: 'Closing'
}

const defaultSectionComponents: Record<string, Component> = {
  cover: SectionsCover,
  bride_groom: SectionsBrideGroom,
  countdown: SectionsCountdown,
  event_details: SectionsEventDetails,
  love_story: SectionsLoveStory,
  gallery: SectionsGallery,
  rsvp: SectionsRsvp,
  guest_wishes: SectionsWishes,
  digital_gift: SectionsGift,
  live_stream: SectionsLiveStream,
  closing: SectionsClosing
}

const themeSectionModules = {
  ...(import.meta.glob('~/components/sections/themes/*/*.vue', {
    eager: true
  }) as Record<string, { default: Component }>)
}

const themeSectionOverrides: Record<string, Component> = {}
for (const [path, module] of Object.entries(themeSectionModules)) {
  const match = path.match(/\/themes\/([^/]+)\/([^/]+)\.vue$/)
  if (!match) continue
  const [, themeKey, componentName] = match
  themeSectionOverrides[`${themeKey}:${componentName}`] = module.default
}

function toPascalCase(sectionType: string) {
  return sectionType
    .split('_')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

function sectionComponentName(sectionType: string) {
  console.log(`[Sections] Resolving component name for section type "${sectionType}"`)
  return builtInSectionComponentNames[sectionType] || toPascalCase(sectionType)
}

function resolveSectionComponent(sectionType: string): Component | null {
  const componentName = sectionComponentName(sectionType)
  const themedComponent = themeSectionOverrides[`${activeTheme.value}:${componentName}`]
  console.log(`[Sections] Resolving component for section type "${sectionType}" (component name: "${componentName}")`, {
    activeTheme: activeTheme.value,
    themedComponentExists: Boolean(themedComponent),
    defaultComponentExists: Boolean(defaultSectionComponents[sectionType]),
    themedComponent: themeSectionOverrides[`${activeTheme.value}:${componentName}`]
  })
  if (themedComponent) return themedComponent
  return defaultSectionComponents[sectionType] || null
}

const activeTheme = computed(() => resolveInvitationTheme(invitation.value?.theme))

const themeStylesheetHref = computed(() => `/themes/${activeTheme.value}.css`)

const activeThemeProfile = computed(() => getInvitationThemeProfile(activeTheme.value))

const enabledSections = computed(() => {
  if (!invitation.value?.sections) {
    console.log('[Sections] No sections in invitation data')
    return []
  }

  const dedupedByType = new Map<string, SectionRecord>()
  for (const section of invitation.value.sections as SectionRecord[]) {
    if (!section?.type || !section.enabled) continue
    // Keep the first section per type based on existing DB order.
    if (!dedupedByType.has(section.type)) {
      dedupedByType.set(section.type, section)
    }
  }

  const baseSections = Array.from(dedupedByType.values())
  const sorted = sortSectionsForTheme(baseSections, activeTheme.value)
  return sorted
})

const sectionRenderers: Record<string, (section: SectionRecord) => SectionRenderer | null> = {
  cover: (section) => {
    if (!invitation.value?.brideName || !invitation.value?.groomName || !invitation.value?.weddingDate) return null
    const component = resolveSectionComponent('cover')
    if (!component) return null
    return {
      component,
      props: {
        invitation: {
          brideName: invitation.value.brideName,
          groomName: invitation.value.groomName,
          weddingDate: invitation.value.weddingDate,
          coverPhoto: invitation.value.coverPhoto || ''
        },
        guestName: guestName.value,
        onOpen: onInvitationOpen,
        freeTexts: sectionFreeTexts(section)
      }
    }
  },
  bride_groom: (section) => {
    if (!invitationOpened.value || !invitation.value?.brideName || !invitation.value?.groomName) return null
    const component = resolveSectionComponent('bride_groom')
    if (!component) return null
    return {
      component,
      props: {
        invitation: {
          brideName: invitation.value.brideName,
          groomName: invitation.value.groomName
        },
        brideProfile: invitation.value.brideProfile,
        groomProfile: invitation.value.groomProfile,
        freeTexts: sectionFreeTexts(section)
      }
    }
  },
  countdown: (section) => {
    if (!invitationOpened.value || !invitation.value?.weddingDate) return null
    const component = resolveSectionComponent('countdown')
    if (!component) return null
    return {
      component,
      props: {
        invitation: { 
          weddingDate: invitation.value.weddingDate,
          brideName: invitation.value.brideName,
          groomName: invitation.value.groomName,
        },
        freeTexts: sectionFreeTexts(section)
      }
    }
  },
  event_details: (section) => {
    if (!invitationOpened.value || !invitation.value?.events?.length) return null
    const component = resolveSectionComponent('event_details')
    if (!component) return null
    return {
      component,
      props: { 
        events: invitation.value.events,
        freeTexts: sectionFreeTexts(section)
      }
    }
  },
  love_story: (section) => {
    if (!invitationOpened.value || !invitation.value?.loveStories?.length) return null
    console.log('[Sections] Attempting to resolve love_story component', JSON.stringify(invitation.value?.loveStories, null, 2))
    const component = resolveSectionComponent('love_story')
    console.log('[Sections] Love Story section enabled, component found:', !!component)
    if (!component) return null
    return {
      component,
      props: {
        stories: invitation.value.loveStories,
        freeTexts: sectionFreeTexts(section)
      }
    }
  },
  gallery: (section) => {
    if (!invitationOpened.value || !invitation.value?.gallery?.length) return null
    const component = resolveSectionComponent('gallery')
    if (!component) return null
    return {
      component,
      props: {
        gallery: invitation.value.gallery,
        freeTexts: sectionFreeTexts(section)
      }
    }
  },
  rsvp: (section) => {
    if (!invitationOpened.value || !invitation.value?.id) return null
    const component = resolveSectionComponent('rsvp')
    if (!component) return null
    return {
      component,
      props: {
        invitationId: invitation.value.id,
        freeTexts: sectionFreeTexts(section)
      }
    }
  },
  guest_wishes: (section) => {
    if (!invitationOpened.value || !invitation.value?.id) return null
    const component = resolveSectionComponent('guest_wishes')
    if (!component) return null
    return {
      component,
      props: {
        invitationId: invitation.value.id,
        wishes: invitation.value.wishes || [],
        freeTexts: sectionFreeTexts(section)
      }
    }
  },
  digital_gift: (section) => {
    if (!invitationOpened.value || !invitation.value?.bankAccounts?.length) return null
    const component = resolveSectionComponent('digital_gift')
    if (!component) return null
    return {
      component,
      props: {
        bankAccounts: invitation.value.bankAccounts,
        freeTexts: sectionFreeTexts(section)
      }
    }
  },
  live_stream: (section) => {
    const youtubeUrl = sectionSettings(section).youtubeUrl
    if (!invitationOpened.value || !youtubeUrl) return null
    const component = resolveSectionComponent('live_stream')
    if (!component) return null
    return {
      component,
      props: {
        youtubeUrl,
        freeTexts: sectionFreeTexts(section)
      }
    }
  },
  closing: (section) => {
    if (!invitationOpened.value || !invitation.value?.brideName || !invitation.value?.groomName) return null
    const component = resolveSectionComponent('closing')
    if (!component) return null
    const settings = sectionSettings(section)
    return {
      component,
      props: {
        gallery: invitation.value.gallery,
        invitation: {
          brideName: invitation.value.brideName,
          groomName: invitation.value.groomName,
          slug: invitation.value.slug
        },
        closingMessage: settings.closingMessage,
        coupleName: settings.coupleName,
        freeTexts: sectionFreeTexts(section)
      }
    }
  }
}

const renderedSections = computed(() => {
  return enabledSections.value.flatMap((section) => {
    try {
      const rendererFactory = sectionRenderers[section.type]

      if (!rendererFactory) {
        const component = resolveSectionComponent(section.type)
        console.log(`[Sections] No renderer factory for section type "${section.type}". Using fallback if component exists:`, { hasComponent: !!component })
        if (component) {
          return [{
            section,
            renderer: {
              component,
              props: {
                invitation: invitation.value,
                section,
                settings: sectionSettings(section),
                invitationOpened: invitationOpened.value,
                guestName: guestName.value
              }
            },
            isFallback: false
          }]
        }
        return [{ section, renderer: null, isFallback: true }]
      }

      const renderer = rendererFactory(section)
      if (!renderer) {
        console.log(`[Sections] Skipping ${section.type} - renderer returned null`)
        return []
      }

      console.log(`[Sections] Rendering ${section.type}`, { invitationOpened: invitationOpened.value })
      return [{ section, renderer, isFallback: false }]
    } catch (err) {
      console.error(`[Sections] Error rendering ${section.type}:`, err)
      return []
    }
  })
})

watch(renderedSections, (sections) => {
  console.log('[Sections] Total rendered:', sections.length, 'Sections:', sections.map(s => ({ type: s.section.type, hasRenderer: !!s.renderer, isFallback: s.isFallback })))
}, { immediate: true })

function shouldShowSectionFreeTexts(section: SectionRecord) {
  return (section.type === 'cover' || invitationOpened.value) && section.type !== 'bride_groom' && sectionFreeTexts(section).length > 0
}

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

function youtubeAutoplayUrl() {
  if (!youtubeMusicBaseEmbedUrl.value) return ''
  const separator = youtubeMusicBaseEmbedUrl.value.includes('?') ? '&' : '?'
  return `${youtubeMusicBaseEmbedUrl.value}${separator}autoplay=1&t=${Date.now()}`
}

function startYoutubeMusicFromGesture() {
  const url = youtubeAutoplayUrl()
  if (!url) return

  // Update iframe src directly inside click/tap gesture for better mobile compatibility.
  if (youtubeIframeRef.value) {
    youtubeIframeRef.value.src = url
  }

  musicPlaying.value = true

  if (MUSIC_DEBUG) {
    console.log('[music] youtube start requested from user gesture', { url })
  }
}
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
    startYoutubeMusicFromGesture()
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
    if (musicPlaying.value) {
      if (youtubeIframeRef.value) youtubeIframeRef.value.src = ''
      musicPlaying.value = false
    } else {
      startYoutubeMusicFromGesture()
    }

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
