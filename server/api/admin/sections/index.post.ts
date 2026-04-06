import { prisma } from '~/server/utils/prisma'
import { requireAdmin } from '~/server/utils/admin'

// POST /api/admin/sections — create section template
export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const body = await readBody(event)
  const { type, title, icon, description, defaultEnabled, displayOrder } = body

  if (!type || !title) throw createError({ statusCode: 400, message: 'type and title are required' })

  const existing = await prisma.sectionTemplate.findUnique({ where: { type } })
  if (existing) throw createError({ statusCode: 409, message: `Section type "${type}" already exists` })

  return prisma.sectionTemplate.create({
    data: {
      type,
      title,
      icon: icon || '📄',
      description: description || '',
      defaultEnabled: defaultEnabled !== false,
      displayOrder: displayOrder ?? 0,
    }
  })
})
