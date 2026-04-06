import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/auth'
import { listDriveFiles, getGalleryType, getDriveThumbnailUrl, getDriveDirectUrl, shareFilePublicly } from '~/server/utils/gdrive'

export default defineEventHandler(async (event) => {
  const { userId } = requireAuth(event)
  const body = await readBody(event)
  const { invitationId } = body

  if (!invitationId) throw createError({ statusCode: 400, message: 'invitationId is required' })

  const invitation = await prisma.invitation.findFirst({ where: { id: invitationId, userId } })
  if (!invitation) throw createError({ statusCode: 404, message: 'Invitation not found' })

  // Fetch files from Google Drive
  const driveFiles = await listDriveFiles()

  let synced = 0
  let skipped = 0

  for (const file of driveFiles) {
    const galleryType = getGalleryType(file.mimeType)
    if (galleryType === 'other') { skipped++; continue }

    const url = galleryType === 'image' ? getDriveThumbnailUrl(file.id) : getDriveDirectUrl(file.id)

    // Check if already synced by driveFileId
    const existing = await prisma.gallery.findFirst({
      where: { invitationId, driveFileId: file.id }
    })

    if (existing) {
      // Update metadata
      await prisma.gallery.update({
        where: { id: existing.id },
        data: { url, driveWebViewLink: file.webViewLink || url, caption: file.name }
      })
    } else {
      // Create new
      await prisma.gallery.create({
        data: {
          invitationId,
          type: galleryType,
          url,
          driveFileId: file.id,
          driveWebViewLink: file.webViewLink || url,
          caption: file.name,
        }
      })
    }
    synced++
    // Ensure file is shared publicly so it shows in browser
    await shareFilePublicly(file.id)
  }

  return {
    success: true,
    synced,
    skipped,
    total: driveFiles.length,
    message: `Synced ${synced} files from Google Drive`
  }
})
