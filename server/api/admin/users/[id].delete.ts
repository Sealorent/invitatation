import { prisma } from '~/server/utils/prisma'
import { requireAdmin } from '~/server/utils/admin'

// DELETE /api/admin/users/:id — delete user
export default defineEventHandler(async (event) => {
  const { user: admin } = await requireAdmin(event)
  const id = getRouterParam(event, 'id')!

  if (id === admin.id) {
    throw createError({ statusCode: 400, message: 'Cannot delete your own account' })
  }

  await prisma.user.delete({ where: { id } })
  return { success: true }
})
