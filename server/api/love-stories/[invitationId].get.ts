import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const { invitationId } = getRouterParams(event)

  try {
    const stories = await prisma.loveStory.findMany({
      where: { invitationId },
      orderBy: { displayOrder: 'asc' }
    })

    // Parse photosJson for each story
    const parsed = stories.map(s => ({
      ...s,
      photos: s.photosJson ? JSON.parse(s.photosJson) : []
    }))

    return parsed
  } catch (e) {
    throw createError({ statusCode: 500, message: 'Failed to fetch love stories' })
  }
})
