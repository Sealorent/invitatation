import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/auth'
import { selectTemplatesForTheme } from '~/utils/invitation-theme-profiles'

export default defineEventHandler(async (event) => {
  const { userId } = requireAuth(event)
  const id = getRouterParam(event, 'id')!

  // Get the invitation
  const invitation = await prisma.invitation.findFirst({
    where: { id, userId },
    include: { sections: true }
  })

  if (!invitation) {
    throw createError({ statusCode: 404, message: 'Invitation not found' })
  }

  // Fetch all active section templates
  const templates = await prisma.sectionTemplate.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: 'asc' }
  })

  // Select templates for this theme
  const selectedTemplates = selectTemplatesForTheme(templates, invitation.theme)

  // --- Start: Non-destructive section generation ---

  // 1. Get existing sections and map them by type for easy lookup
  const existingSections = await prisma.section.findMany({
    where: { invitationId: id }
  })
  const existingSectionsMap = new Map(existingSections.map(s => [s.type, s]))

  // 2. Identify missing sections to be created
  const sectionsToCreate = selectedTemplates.filter(template => !existingSectionsMap.has(template.type))

  // 3. Create only the missing sections
  if (sectionsToCreate.length > 0) {
    await prisma.section.createMany({
      data: sectionsToCreate.map((t, i) => ({
        invitationId: id,
        type: t.type,
        title: t.title,
        enabled: t.defaultEnabled,
        // Place new sections at the end
        displayOrder: (existingSections.length) + i,
      }))
    })
  }

  // 4. Identify and delete duplicates, keeping the one with the lowest displayOrder (usually the original)
  const allSectionsAfterAdd = await prisma.section.findMany({
    where: { invitationId: id },
    orderBy: { displayOrder: 'asc' }
  })

  const seenTypes = new Set<string>()
  const sectionsToDelete: string[] = []
  for (const section of allSectionsAfterAdd) {
    if (seenTypes.has(section.type)) {
      sectionsToDelete.push(section.id)
    } else {
      seenTypes.add(section.type)
    }
  }

  if (sectionsToDelete.length > 0) {
    await prisma.section.deleteMany({
      where: { id: { in: sectionsToDelete } }
    })
  }
  
  // --- End: Non-destructive section generation ---


  // Fetch and return the final, clean list of sections
  const finalSections = await prisma.section.findMany({
    where: { invitationId: id },
    orderBy: { displayOrder: 'asc' }
  })

  return { 
    message: `✅ Sections synced. ${sectionsToCreate.length} added, ${sectionsToDelete.length} duplicates removed.`,
    sections: finalSections 
  }
})
