import { prisma } from '~/server/utils/prisma'
import { requireAdmin } from '~/server/utils/admin'

// PUT /api/admin/users/:id — update user plan/role
export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const id = getRouterParam(event, 'id')!
  const body = await readBody(event)
  const { plan, role, name, email } = body

  const updateData: Record<string, unknown> = {}
  if (plan !== undefined) updateData.plan = plan
  if (role !== undefined) updateData.role = role
  if (name !== undefined) updateData.name = name
  if (email !== undefined) updateData.email = email

  const user = await prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      plan: true,
      role: true,
      phone: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { invitations: true } }
    }
  })

  return user
})
