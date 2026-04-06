import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/auth'

// PUT /api/sections/:invitationId — bulk update/reorder sections
export default defineEventHandler(async (event) => {
  const { userId } = requireAuth(event)
  const invitationId = getRouterParam(event, 'invitationId')!
  const body = await readBody(event)
  const sections = Array.isArray(body)
    ? body
    : (body as { sections?: unknown })?.sections

  if (!Array.isArray(sections)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid payload: sections must be an array'
    })
  }

  const invitation = await prisma.invitation.findFirst({ where: { id: invitationId, userId } })
  if (!invitation) throw createError({ statusCode: 404, message: 'Invitation not found' })

  // Upsert each section
  const updates = await Promise.all(
    sections.map(async (rawSection, i) => {
      const s = (rawSection && typeof rawSection === 'object')
        ? (rawSection as Record<string, unknown>)
        : {}

      if (s.id) {
        return prisma.section.update({
          where: { id: s.id as string },
          data: {
            title: s.title as string,
            enabled: s.enabled as boolean,
            displayOrder: typeof s.displayOrder === 'number' ? s.displayOrder : i,
            settingsJson: typeof s.settingsJson === 'string' ? s.settingsJson : JSON.stringify(s.settingsJson || {})
          }
        })
      } else {
        return prisma.section.create({
          data: {
            invitationId,
            type: s.type as string,
            title: (s.title as string) || (s.type as string),
            enabled: s.enabled !== false,
            displayOrder: typeof s.displayOrder === 'number' ? s.displayOrder : i,
            settingsJson: typeof s.settingsJson === 'string' ? s.settingsJson : JSON.stringify(s.settingsJson || {})
          }
        })
      }
    })
  )

  return updates
})
