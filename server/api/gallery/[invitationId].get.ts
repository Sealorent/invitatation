import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const { userId } = requireAuth(event)
  const invitationId = getRouterParam(event, 'invitationId')!

  const invitation = await prisma.invitation.findFirst({ where: { id: invitationId, userId } })
  if (!invitation) throw createError({ statusCode: 404, message: 'Not found' })

  const query = getQuery(event)
  const page = parseInt(query.page as string) || 1
  const limit = parseInt(query.limit as string) || 12
  const skip = (page - 1) * limit

  const [gallery, total] = await Promise.all([
    prisma.gallery.findMany({
      where: { invitationId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.gallery.count({ where: { invitationId } })
  ])

  return {
    items: gallery,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  }
})
