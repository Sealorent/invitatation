import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')!

  const invitation = await prisma.invitation.findUnique({
    where: { slug },
    include: {
      sections: {
        where: { enabled: true },
        orderBy: { displayOrder: 'asc' }
      },
      events: { orderBy: { displayOrder: 'asc' } },
      loveStories: { orderBy: { displayOrder: 'asc' } },
      gallery: { orderBy: { displayOrder: 'asc' } },
      bankAccounts: { orderBy: { displayOrder: 'asc' } },
      wishes: {
        where: { isApproved: true },
        orderBy: { createdAt: 'desc' },
        take: 50
      },
      rsvps: { orderBy: { createdAt: 'desc' }, take: 50 },
      brideProfile: true,
      groomProfile: true,
    }
  })

  if (!invitation) {
    throw createError({ statusCode: 404, message: 'Invitation not found' })
  }

  // Don't expose user/password data
  const { userId, ...publicData } = invitation as Record<string, unknown>
  return publicData
})
