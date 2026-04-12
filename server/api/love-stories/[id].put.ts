import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const { id } = getRouterParams(event)
    const body = await readBody(event)
    const { title, subtitle, year, photos, displayOrder } = body
    const normalizedYear = year !== undefined && year !== null && String(year).trim() !== ''
      ? String(year)
      : undefined

    const story = await prisma.loveStory.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(subtitle !== undefined && { subtitle }),
        ...(normalizedYear !== undefined && { year: normalizedYear }),
        ...(photos && { photosJson: JSON.stringify(photos) }),
        ...(displayOrder !== undefined && { displayOrder })
      }
    })

    return {
      ...story,
      photos: JSON.parse(story.photosJson)
    }
  } catch (e: any) {
    throw createError({
      statusCode: e.statusCode || 500,
      message: e.message || 'Failed to update love story'
    })
  }
})
