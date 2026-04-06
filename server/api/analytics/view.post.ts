import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { invitationId, visitor } = body || {}

  // Record view
  const ip = getRequestHeader(event, 'x-forwarded-for') || getRequestHeader(event, 'x-real-ip') || 'unknown'

  if (invitationId) {
    await prisma.analytics.create({
      data: {
        invitationId,
        visitorIp: ip,
        userAgent: getRequestHeader(event, 'user-agent') || '',
        guestName: visitor?.name || null,
      }
    })
  }

  return { success: true }
})
