import jwt from 'jsonwebtoken'
import type { H3Event } from 'h3'

export interface JwtPayload {
  userId: string
  email: string
  name: string
}

export function signToken(payload: JwtPayload): string {
  const config = useRuntimeConfig()
  return jwt.sign(payload, config.jwtSecret, { expiresIn: '30d' })
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    const config = useRuntimeConfig()
    return jwt.verify(token, config.jwtSecret) as JwtPayload
  } catch {
    return null
  }
}

export function requireAuth(event: H3Event): JwtPayload {
  const authHeader = getRequestHeader(event, 'authorization')
  const cookieToken = getCookie(event, 'auth_token')
  
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.slice(7)
    : cookieToken

  if (!token) {
    throw createError({ statusCode: 401, message: 'Unauthorized: No token provided' })
  }

  const payload = verifyToken(token)
  if (!payload) {
    throw createError({ statusCode: 401, message: 'Unauthorized: Invalid token' })
  }

  return payload
}

export function getOptionalAuth(event: H3Event): JwtPayload | null {
  try {
    return requireAuth(event)
  } catch {
    return null
  }
}
