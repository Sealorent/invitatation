import { prisma } from '~/server/utils/prisma'
import { requireAdmin } from '~/server/utils/admin'

// PUT /api/admin/sections/:id — update section template
export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = getRouterParam(event, 'id')!
  const body = await readBody(event)

  const { title, icon, description, defaultEnabled, displayOrder, isActive } = body
  const data: Record<string, unknown> = {}
  if (title !== undefined) data.title = title
  if (icon !== undefined) data.icon = icon
  if (description !== undefined) data.description = description
  if (defaultEnabled !== undefined) data.defaultEnabled = defaultEnabled
  if (displayOrder !== undefined) data.displayOrder = displayOrder
  if (isActive !== undefined) data.isActive = isActive

  return prisma.sectionTemplate.update({ where: { id }, data })
})
