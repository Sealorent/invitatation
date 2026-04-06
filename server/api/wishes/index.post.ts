import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { invitationId, name, message } = body

  if (!invitationId || !name || !message) {
    throw createError({ statusCode: 400, message: 'invitationId, name, and message are required' })
  }

  const wish = await prisma.wish.create({
    data: { invitationId, name, message }
  })

  return wish
})
