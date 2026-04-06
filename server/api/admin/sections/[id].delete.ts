import { prisma } from '~/server/utils/prisma'
import { requireAdmin } from '~/server/utils/admin'

// DELETE /api/admin/sections/:id — delete section template
export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = getRouterParam(event, 'id')!
  await prisma.sectionTemplate.delete({ where: { id } })
  return { success: true }
})
