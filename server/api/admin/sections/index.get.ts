import { prisma } from '~/server/utils/prisma'
import { requireAdmin } from '~/server/utils/admin'

// GET /api/admin/sections — list all section templates
export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  return prisma.sectionTemplate.findMany({ orderBy: { displayOrder: 'asc' } })
})
