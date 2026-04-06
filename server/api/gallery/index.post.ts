import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const { userId } = requireAuth(event)
  const body = await readBody(event)
  const { invitationId, type, url, caption, displayOrder } = body

  if (!invitationId || !url) {
    throw createError({ statusCode: 400, message: 'invitationId and url are required' })
  }

  const invitation = await prisma.invitation.findFirst({ where: { id: invitationId, userId } })
  if (!invitation) throw createError({ statusCode: 404, message: 'Invitation not found' })

  const item = await prisma.gallery.create({
    data: {
      invitationId,
      type: type || 'image',
      url,
      caption: caption || null,
      displayOrder: displayOrder || 0,
    }
  })

  return item
})
