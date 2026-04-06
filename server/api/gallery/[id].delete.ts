import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const { userId } = requireAuth(event)
  const id = getRouterParam(event, 'id')!

  const item = await prisma.gallery.findUnique({
    where: { id },
    include: { invitation: { select: { userId: true } } }
  })

  if (!item || item.invitation.userId !== userId) {
    throw createError({ statusCode: 404, message: 'Gallery item not found' })
  }

  await prisma.gallery.delete({ where: { id } })
  return { success: true }
})
