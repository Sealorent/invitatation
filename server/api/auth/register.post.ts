import bcrypt from 'bcryptjs'
import { prisma } from '~/server/utils/prisma'
import { signToken } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { name, email, password } = body

  if (!name || !email || !password) {
    throw createError({ statusCode: 400, message: 'Name, email and password are required' })
  }

  if (password.length < 8) {
    throw createError({ statusCode: 400, message: 'Password must be at least 8 characters' })
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    throw createError({ statusCode: 409, message: 'Email already registered' })
  }

  const hashed = await bcrypt.hash(password, 12)

  const user = await prisma.user.create({
    data: { name, email, password: hashed, plan: 'free' },
    select: { id: true, name: true, email: true, plan: true, createdAt: true }
  })

  const token = signToken({ userId: user.id, email: user.email, name: user.name })

  setCookie(event, 'auth_token', token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
    sameSite: 'lax'
  })

  return { user, token }
})
