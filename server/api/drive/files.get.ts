import { requireAuth } from '~/server/utils/auth'
import { listDriveFiles } from '~/server/utils/gdrive'

export default defineEventHandler(async (event) => {
  requireAuth(event)
  const files = await listDriveFiles()
  return { files, total: files.length }
})
