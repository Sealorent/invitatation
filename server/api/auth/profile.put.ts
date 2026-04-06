import bcrypt from 'bcryptjs'
import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const { userId } = requireAuth(event)
  const body = await readBody(event)
  const { name, phone, address, avatar, currentPassword, newPassword } = body

  const updateData: Record<string, unknown> = {}

  if (name) updateData.name = name
  if (phone !== undefined) updateData.phone = phone
  if (address !== undefined) updateData.address = address
  if (avatar !== undefined) updateData.avatar = avatar

  // Handle password change
  if (newPassword) {
    if (!currentPassword) {
      throw createError({ statusCode: 400, message: 'Current password required' })
    }
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) throw createError({ statusCode: 404, message: 'User not found' })
    
    const valid = await bcrypt.compare(currentPassword, user.password)
    if (!valid) throw createError({ statusCode: 400, message: 'Current password is incorrect' })
    
    updateData.password = await bcrypt.hash(newPassword, 12)
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: { id: true, name: true, email: true, plan: true, avatar: true, phone: true, address: true }
  })

  return updated
})
