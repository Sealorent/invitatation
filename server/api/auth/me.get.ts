import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const { userId } = requireAuth(event)

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, plan: true, role: true, avatar: true, phone: true, address: true, createdAt: true }
  })

  if (!user) {
    throw createError({ statusCode: 404, message: 'User not found' })
  }

  return user
})
