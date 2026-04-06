// Seed script: create admin user
// Run with: npx tsx prisma/seed.ts

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminEmail = 'admin@wedding.com'
  const adminPassword = 'admin123'

  const existing = await prisma.user.findUnique({ where: { email: adminEmail } })

  if (existing) {
    // Update to admin if not already
    await prisma.user.update({
      where: { email: adminEmail },
      data: { role: 'admin', plan: 'pro' }
    })
    console.log(`✅ Updated existing user "${adminEmail}" to admin role`)
  } else {
    const hashed = await bcrypt.hash(adminPassword, 12)
    await prisma.user.create({
      data: {
        name: 'Admin',
        email: adminEmail,
        password: hashed,
        role: 'admin',
        plan: 'pro'
      }
    })
    console.log(`✅ Created admin user:`)
  }

  console.log(`   📧 Email: ${adminEmail}`)
  console.log(`   🔑 Password: ${adminPassword}`)
  console.log(`   🔗 Login at: http://localhost:3000/login`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
