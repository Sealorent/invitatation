import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const { userId } = requireAuth(event)
  const id = getRouterParam(event, 'id')!

  const existing = await prisma.invitation.findFirst({ where: { id, userId } })
  if (!existing) {
    throw createError({ statusCode: 404, message: 'Invitation not found' })
  }

  await prisma.invitation.delete({ where: { id } })
  return { success: true }
})
