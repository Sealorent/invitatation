import { prisma } from '~/server/utils/prisma'
import { requireAdmin } from '~/server/utils/admin'

// GET /api/admin/users — list all users
export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      plan: true,
      role: true,
      phone: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: { invitations: true }
      }
    }
  })

  return users
})
