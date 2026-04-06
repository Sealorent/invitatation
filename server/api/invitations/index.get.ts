import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const { userId } = requireAuth(event)

  const invitations = await prisma.invitation.findMany({
    where: { userId },
    include: {
      _count: {
        select: { rsvps: true, wishes: true, analytics: true, guests: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return invitations
})
