// Seed default section templates
// Run with: npx tsx prisma/seed-sections.ts

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const defaultSections = [
  { type: 'cover', title: 'Cover', icon: '🖼️', description: 'Opening cover with couple names and photo', defaultEnabled: true, displayOrder: 0 },
  { type: 'bride_groom', title: 'Bride & Groom', icon: '👰', description: 'Bride and groom profiles with photos and parents', defaultEnabled: true, displayOrder: 1 },
  { type: 'countdown', title: 'Countdown', icon: '⏳', description: 'Live countdown timer to wedding day', defaultEnabled: true, displayOrder: 2 },
  { type: 'event_details', title: 'Event Details', icon: '📍', description: 'Ceremony and reception details with maps link', defaultEnabled: true, displayOrder: 3 },
  { type: 'love_story', title: 'Love Story', icon: '💕', description: 'Timeline of how the couple met', defaultEnabled: false, displayOrder: 4 },
  { type: 'gallery', title: 'Gallery', icon: '📸', description: 'Photo and video gallery with lightbox', defaultEnabled: false, displayOrder: 5 },
  { type: 'rsvp', title: 'RSVP', icon: '✅', description: 'Guest RSVP form with attendance confirmation', defaultEnabled: true, displayOrder: 6 },
  { type: 'guest_wishes', title: 'Guest Wishes', icon: '💌', description: 'Guest message and wishes board', defaultEnabled: true, displayOrder: 7 },
  { type: 'digital_gift', title: 'Digital Gift', icon: '🎁', description: 'Bank account info and QR codes for gifts', defaultEnabled: false, displayOrder: 8 },
  { type: 'live_stream', title: 'Live Stream', icon: '📹', description: 'YouTube live stream embed', defaultEnabled: false, displayOrder: 9 },
  { type: 'closing', title: 'Closing', icon: '🌸', description: 'Thank you message with share buttons', defaultEnabled: true, displayOrder: 10 },
]

async function main() {
  for (const section of defaultSections) {
    await prisma.sectionTemplate.upsert({
      where: { type: section.type },
      update: { ...section },
      create: { ...section }
    })
    console.log(`  ✅ ${section.icon} ${section.title} (${section.type})`)
  }
  console.log(`\n🎉 Seeded ${defaultSections.length} section templates!`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
