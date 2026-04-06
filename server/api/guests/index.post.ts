import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const { userId } = requireAuth(event)
  const body = await readBody(event)
  const { invitationId, name, phone } = body

  if (!invitationId || !name) {
    throw createError({ statusCode: 400, message: 'invitationId and name required' })
  }

  const invitation = await prisma.invitation.findFirst({ where: { id: invitationId, userId } })
  if (!invitation) throw createError({ statusCode: 404, message: 'Invitation not found' })

  const QRCode = await import('qrcode')
  const qrData = JSON.stringify({ invitationId, guestName: name, generatedAt: new Date().toISOString() })
  const qrBase64 = await QRCode.default.toDataURL(qrData)

  const guest = await prisma.guest.create({
    data: { invitationId, name, phone: phone || null, qrCode: qrBase64 }
  })

  return guest
})
