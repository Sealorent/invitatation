import { Readable } from 'stream'
import { uploadDriveFile, getDriveThumbnailUrl } from '~/server/utils/gdrive'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const { userId } = requireAuth(event)
  
  const formData = await readMultipartFormData(event)
  if (!formData || formData.length === 0) {
    throw createError({ statusCode: 400, message: 'No file uploaded' })
  }

  const file = formData.find(item => item.name === 'file')
  if (!file || !file.data) {
    throw createError({ statusCode: 400, message: 'File is required' })
  }

  const filename = file.filename || `upload-${Date.now()}`
  const mimeType = file.type || 'application/octet-stream'
  const invitationIdItem = formData.find(item => item.name === 'invitationId')
  const invitationId = invitationIdItem?.data.toString()

  if (!invitationId) {
    throw createError({ statusCode: 400, message: 'invitationId is required' })
  }

  // Convert buffer to stream for googleapi
  const bufferStream = new Readable()
  bufferStream.push(file.data)
  bufferStream.push(null)

  try {
    const driveFile = await uploadDriveFile(filename, mimeType, bufferStream)
    
    // Auto-sync the new file to the gallery
    await prisma.gallery.create({
      data: {
        invitationId,
        type: mimeType.startsWith('video/') ? 'video' : 'image',
        url: getDriveThumbnailUrl(driveFile.id),
        driveFileId: driveFile.id,
        driveWebViewLink: driveFile.webViewLink,
        caption: filename
      }
    })

    return driveFile
  } catch (error: any) {
    throw createError({ statusCode: 500, message: error.message || 'Failed to upload to Google Drive' })
  }
})
