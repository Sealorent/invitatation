import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { invitationId, guestName, phone, attendance, guestCount, message } = body

  if (!invitationId || !guestName || !attendance) {
    throw createError({ statusCode: 400, message: 'invitationId, guestName, and attendance are required' })
  }

  const rsvp = await prisma.rsvp.create({
    data: {
      invitationId,
      guestName,
      phone: phone || null,
      attendance,
      guestCount: guestCount || 1,
      message: message || null,
    }
  })

  return rsvp
})
