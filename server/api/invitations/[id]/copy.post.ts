import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const { userId } = requireAuth(event)
  const id = getRouterParam(event, 'id')!

  const original = await prisma.invitation.findFirst({
    where: { id, userId },
    include: {
      sections: true,
      events: true,
      bankAccounts: true,
      brideProfile: true,
      groomProfile: true,
      gallery: true,
      loveStories: true,
      _count: { select: { analytics: true, rsvps: true, wishes: true } }
    }
  })

  if (!original) {
    throw createError({ statusCode: 404, message: 'Invitation not found' })
  }

  const baseSlug = `${original.groomName.toLowerCase().replace(/\s+/g, '-')}-${original.brideName.toLowerCase().replace(/\s+/g, '-')}`
  const random = Math.random().toString(36).substring(2, 7)
  const slug = `${baseSlug}-copy-${random}`

  let newBrideProfileId: string | null = null
  let newGroomProfileId: string | null = null

  if (original.brideProfile) {
    const bp = await prisma.brideGroomProfile.create({
      data: {
        name: original.brideProfile.name,
        photo: original.brideProfile.photo,
        fatherName: original.brideProfile.fatherName,
        motherName: original.brideProfile.motherName,
        instagram: original.brideProfile.instagram,
        bio: original.brideProfile.bio,
        role: original.brideProfile.role || 'bride',
      }
    })
    newBrideProfileId = bp.id
  }

  if (original.groomProfile) {
    const gp = await prisma.brideGroomProfile.create({
      data: {
        name: original.groomProfile.name,
        photo: original.groomProfile.photo,
        fatherName: original.groomProfile.fatherName,
        motherName: original.groomProfile.motherName,
        instagram: original.groomProfile.instagram,
        bio: original.groomProfile.bio,
        role: original.groomProfile.role || 'groom',
      }
    })
    newGroomProfileId = gp.id
  }

  const duplicate = await prisma.invitation.create({
    data: {
      userId,
      slug,
      brideName: original.brideName,
      groomName: original.groomName,
      weddingDate: original.weddingDate,
      theme: original.theme,
      coverPhoto: original.coverPhoto,
      musicUrl: original.musicUrl,
      isPublished: false,
      brideProfileId: newBrideProfileId,
      groomProfileId: newGroomProfileId,
      sections: {
        create: original.sections.map((s) => ({
          type: s.type,
          title: s.title,
          enabled: s.enabled,
          displayOrder: s.displayOrder,
          settingsJson: s.settingsJson,
        }))
      },
      events: {
        create: original.events.map((e) => ({
          title: e.title,
          type: e.type,
          date: e.date,
          time: e.time,
          venue: e.venue,
          address: e.address,
          mapsLink: e.mapsLink,
          displayOrder: e.displayOrder,
        }))
      },
      bankAccounts: {
        create: original.bankAccounts.map((b) => ({
          bankName: b.bankName,
          accountNumber: b.accountNumber,
          accountHolder: b.accountHolder,
          qrCode: b.qrCode,
          displayOrder: b.displayOrder,
        }))
      },
      gallery: {
        create: original.gallery.map((g) => ({
          url: g.url,
          type: g.type,
          caption: g.caption,
          driveFileId: g.driveFileId,
          driveWebViewLink: g.driveWebViewLink,
          displayOrder: g.displayOrder,
        }))
      },
      loveStories: {
        create: original.loveStories.map((ls) => ({
          title: ls.title,
          subtitle: ls.subtitle,
          description: ls.description,
          photo: ls.photo,
          photosJson: ls.photosJson,
          year: ls.year,
          displayOrder: ls.displayOrder,
        }))
      },
    },
    include: {
      sections: true,
      _count: { select: { analytics: true, rsvps: true, wishes: true } }
    }
  })

  return duplicate
})
