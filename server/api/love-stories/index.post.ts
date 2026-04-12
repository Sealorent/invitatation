import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { invitationId, title, subtitle, year, photos } = body
    const normalizedYear = year !== undefined && year !== null && String(year).trim() !== ''
      ? String(year)
      : new Date().getFullYear().toString()

    if (!invitationId || !title) {
      throw createError({ statusCode: 400, message: 'Missing required fields' })
    }

    // Get max displayOrder
    const lastStory = await prisma.loveStory.findFirst({
      where: { invitationId },
      orderBy: { displayOrder: 'desc' }
    })

    const displayOrder = (lastStory?.displayOrder || -1) + 1

    const story = await prisma.loveStory.create({
      data: {
        invitationId,
        title,
        subtitle: subtitle || '',
        year: normalizedYear,
        photosJson: JSON.stringify(photos || []),
        displayOrder
      }
    })

    return {
      ...story,
      photos: JSON.parse(story.photosJson)
    }
  } catch (e: any) {
    throw createError({
      statusCode: e.statusCode || 500,
      message: e.message || 'Failed to create love story'
    })
  }
})
