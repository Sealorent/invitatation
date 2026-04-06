import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const { userId } = requireAuth(event)
  const sectionId = getRouterParam(event, 'id')!

  const section = await prisma.section.findUnique({
    where: { id: sectionId },
    include: { invitation: { select: { userId: true } } }
  })

  if (!section || section.invitation.userId !== userId) {
    throw createError({ statusCode: 404, message: 'Section not found' })
  }

  await prisma.section.delete({ where: { id: sectionId } })
  return { success: true }
})
