import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL || process.env.NUXT_DATABASE_URL,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

if (!process.env.DATABASE_URL && !process.env.NUXT_DATABASE_URL) {
  console.error('Prisma DATABASE_URL is missing. Set DATABASE_URL (or NUXT_DATABASE_URL) in the runtime environment.')
}

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}
