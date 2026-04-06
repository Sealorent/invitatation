import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/auth'
import type { H3Event } from 'h3'

export async function requireAdmin(event: H3Event) {
  const { userId } = requireAuth(event)
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user || user.role !== 'admin') {
    throw createError({ statusCode: 403, message: 'Admin access required' })
  }
  return { userId, user }
}
