export const invitationThemeProfiles = {
  romantic_classic: {
    sectionVariants: {
      gallery: 'masonry-soft',
      event_details: 'cards-classic',
      love_story: 'timeline-classic'
    },
    sectionLayouts: {
      gallery: 'standard'
    },
    sectionOrder: [
      'cover',
      'bride_groom',
      'countdown',
      'event_details',
      'love_story',
      'gallery',
      'rsvp',
      'guest_wishes',
      'digital_gift',
      'live_stream',
      'closing'
    ]
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
    sectionOrder: [
      'cover',
      'countdown',
      'event_details',
      'gallery',
      'rsvp',
      'closing'
    ]
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
    sectionOrder: [
      'cover',
      'bride_groom',
      'event_details',
      'countdown',
      'love_story',
      'gallery',
      'rsvp',
      'guest_wishes',
      'digital_gift',
      'live_stream',
      'closing'
    ]
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
    sectionOrder: [
      'cover',
      'bride_groom',
      'countdown',
      'love_story',
      'event_details',
      'gallery',
      'rsvp',
      'guest_wishes',
      'closing'
    ]
  },
  simple: {
    sectionVariants: {
      gallery: 'grid-clean',
      event_details: 'cards-minimal',
      countdown: 'compact'
    },
    sectionLayouts: {
      event_details: 'spacious'
    },
    sectionOrder: [
      'cover',
      'bride_groom',
      'countdown',
      'event_details',
      'love_story',
      'gallery',
      'rsvp',
      'guest_wishes',
      'digital_gift',
      'live_stream',
      'closing'
    ]
  }
} as const

export type InvitationThemeKey = keyof typeof invitationThemeProfiles

const defaultTheme: InvitationThemeKey = 'romantic_classic'

export function resolveInvitationTheme(theme: unknown): InvitationThemeKey {
  const themeKey = String(theme || defaultTheme)
  return themeKey in invitationThemeProfiles ? (themeKey as InvitationThemeKey) : defaultTheme
}

export function getInvitationThemeProfile(theme: unknown) {
  return invitationThemeProfiles[resolveInvitationTheme(theme)]
}

export function getThemeSectionOrder(theme: unknown) {
  return getInvitationThemeProfile(theme).sectionOrder
}

export function sortSectionsForTheme<T extends { type: string; displayOrder?: number }>(sections: T[], theme: unknown) {
  // Always sort by displayOrder first, which is the explicit user-defined order
  return [...sections].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
}

export function selectTemplatesForTheme<T extends { type: string; displayOrder?: number }>(templates: T[], theme: unknown) {
  const order = getThemeSectionOrder(theme)
  if (!order.length) {
    return [...templates].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
  }

  const templateByType = new Map(templates.map((template) => [template.type, template]))
  return order.map((type) => templateByType.get(type)).filter((template): template is T => Boolean(template))
}
