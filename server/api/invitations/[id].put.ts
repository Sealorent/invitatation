import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const { userId } = requireAuth(event)
  const id = getRouterParam(event, 'id')!
  const body = await readBody(event)

  const existing = await prisma.invitation.findFirst({ where: { id, userId } })
  if (!existing) {
    throw createError({ statusCode: 404, message: 'Invitation not found' })
  }

  const {
    brideName, groomName, weddingDate, coverPhoto, musicUrl, theme,
    isPublished, brideProfile, groomProfile, events, loveStories, bankAccounts
  } = body

  const updateData: Record<string, unknown> = {}
  if (brideName !== undefined) updateData.brideName = brideName
  if (groomName !== undefined) updateData.groomName = groomName
  if (weddingDate !== undefined) updateData.weddingDate = new Date(weddingDate)
  if (coverPhoto !== undefined) updateData.coverPhoto = coverPhoto
  if (musicUrl !== undefined) updateData.musicUrl = musicUrl
  if (theme !== undefined) updateData.theme = theme
  if (isPublished !== undefined) updateData.isPublished = isPublished

  // Update bride profile
  if (brideProfile) {
    if (existing.brideProfileId) {
      await prisma.brideGroomProfile.update({
        where: { id: existing.brideProfileId },
        data: { ...brideProfile, role: 'bride' }
      })
    } else {
      const bp = await prisma.brideGroomProfile.create({ data: { ...brideProfile, role: 'bride' } })
      updateData.brideProfileId = bp.id
    }
  }

  // Update groom profile
  if (groomProfile) {
    if (existing.groomProfileId) {
      await prisma.brideGroomProfile.update({
        where: { id: existing.groomProfileId },
        data: { ...groomProfile, role: 'groom' }
      })
    } else {
      const gp = await prisma.brideGroomProfile.create({ data: { ...groomProfile, role: 'groom' } })
      updateData.groomProfileId = gp.id
    }
  }

  // Update events (replace all)
  if (events !== undefined) {
    await prisma.event.deleteMany({ where: { invitationId: id } })
    if (events.length > 0) {
      await prisma.event.createMany({
        data: events.map((e: Record<string, unknown>, i: number) => ({
          ...e,
          invitationId: id,
          date: new Date(e.date as string),
          displayOrder: i
        }))
      })
    }
  }

  // Update love stories
  if (loveStories !== undefined) {
    await prisma.loveStory.deleteMany({ where: { invitationId: id } })
    if (loveStories.length > 0) {
      await prisma.loveStory.createMany({
        data: loveStories.map((s: Record<string, unknown>, i: number) => ({
          ...s,
          invitationId: id,
          displayOrder: i
        }))
      })
    }
  }

  // Update bank accounts
  if (bankAccounts !== undefined) {
    await prisma.bankAccount.deleteMany({ where: { invitationId: id } })
    if (bankAccounts.length > 0) {
      await prisma.bankAccount.createMany({
        data: bankAccounts.map((b: Record<string, unknown>, i: number) => ({
          ...b,
          invitationId: id,
          displayOrder: i
        }))
      })
    }
  }

  const updated = await prisma.invitation.update({
    where: { id },
    data: updateData,
    include: {
      sections: { orderBy: { displayOrder: 'asc' } },
      events: { orderBy: { displayOrder: 'asc' } },
      loveStories: { orderBy: { displayOrder: 'asc' } },
      bankAccounts: { orderBy: { displayOrder: 'asc' } },
      brideProfile: true,
      groomProfile: true,
    }
  })

  return updated
})
