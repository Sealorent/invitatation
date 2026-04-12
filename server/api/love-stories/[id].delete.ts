import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const { id } = getRouterParams(event)

    await prisma.loveStory.delete({
      where: { id }
    })

    return { success: true }
  } catch (e: any) {
    throw createError({
      statusCode: e.statusCode || 500,
      message: e.message || 'Failed to delete love story'
    })
  }
})
