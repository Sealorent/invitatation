import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const { userId } = requireAuth(event)
  const id = getRouterParam(event, 'id')!

  const wish = await prisma.wish.findUnique({
    where: { id },
    include: { invitation: { select: { userId: true } } }
  })

  if (!wish || wish.invitation.userId !== userId) {
    throw createError({ statusCode: 404, message: 'Wish not found' })
  }

  await prisma.wish.delete({ where: { id } })
  return { success: true }
})