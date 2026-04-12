import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/auth'

function parseLoveStoryPhotos(story: Record<string, any>) {
  let photos: string[] = []

  try {
    photos = story.photosJson ? JSON.parse(story.photosJson) : []
  } catch {
    photos = []
  }

  return {
    ...story,
    photos,
    photo: story.photo || photos[0] || ''
  }
}

export default defineEventHandler(async (event) => {
  const { userId } = requireAuth(event)
  const id = getRouterParam(event, 'id')!

  const invitation = await prisma.invitation.findFirst({
    where: { id, userId },
    include: {
      sections: { orderBy: { displayOrder: 'asc' } },
      events: { orderBy: { displayOrder: 'asc' } },
      loveStories: { orderBy: { displayOrder: 'asc' } },
      gallery: { orderBy: { displayOrder: 'asc' } },
      bankAccounts: { orderBy: { displayOrder: 'asc' } },
      brideProfile: true,
      groomProfile: true,
      _count: { select: { rsvps: true, wishes: true, analytics: true, guests: true } }
    }
  })

  if (!invitation) {
    throw createError({ statusCode: 404, message: 'Invitation not found' })
  }

  return {
    ...invitation,
    loveStories: Array.isArray(invitation.loveStories)
      ? invitation.loveStories.map(parseLoveStoryPhotos)
      : []
  }
})
