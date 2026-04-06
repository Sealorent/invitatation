import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const { userId } = requireAuth(event)
  const invitationId = getRouterParam(event, 'invitationId')!

  const invitation = await prisma.invitation.findFirst({ where: { id: invitationId, userId } })
  if (!invitation) throw createError({ statusCode: 404, message: 'Not found' })

  const guests = await prisma.guest.findMany({
    where: { invitationId },
    orderBy: { createdAt: 'desc' }
  })
  return guests
})
