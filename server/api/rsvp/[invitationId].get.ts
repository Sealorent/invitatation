import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const { userId } = requireAuth(event)
  const invitationId = getRouterParam(event, 'invitationId')!

  const invitation = await prisma.invitation.findFirst({ where: { id: invitationId, userId } })
  if (!invitation) throw createError({ statusCode: 404, message: 'Invitation not found' })

  const rsvps = await prisma.rsvp.findMany({
    where: { invitationId },
    orderBy: { createdAt: 'desc' }
  })

  const stats = {
    total: rsvps.length,
    yes: rsvps.filter(r => r.attendance === 'yes').length,
    no: rsvps.filter(r => r.attendance === 'no').length,
    maybe: rsvps.filter(r => r.attendance === 'maybe').length,
    totalGuests: rsvps.filter(r => r.attendance === 'yes').reduce((acc, r) => acc + r.guestCount, 0),
  }

  return { rsvps, stats }
})
