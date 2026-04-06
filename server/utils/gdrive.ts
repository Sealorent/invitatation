import { google } from 'googleapis'
import { join } from 'node:path'
import { existsSync, readFileSync } from 'node:fs'

export interface DriveFile {
  id: string
  name: string
  mimeType: string
  size?: string
  webViewLink?: string
  webContentLink?: string
  thumbnailLink?: string
  createdTime?: string
  modifiedTime?: string
}

function getAuthClient() {
  const config = useRuntimeConfig()

  let credentials: Record<string, unknown>

  // Try to parse GDRIVE_CREDENTIALS from env
  try {
    if (config.gdriveCredentials && config.gdriveCredentials !== 'JSON_FILE_CONTENT') {
      credentials = JSON.parse(config.gdriveCredentials)
    } else {
      // Fall back to reading the JSON file in project root
      const jsonPath = join(process.cwd(), 'eighth-orbit-447712-a4-797832315f48.json')
      if (existsSync(jsonPath)) {
        credentials = JSON.parse(readFileSync(jsonPath, 'utf-8'))
      } else {
        throw new Error('Google Drive credentials not found')
      }
    }
  } catch (e) {
    throw createError({ statusCode: 500, message: 'Google Drive credentials not configured: ' + String(e) })
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: [
      'https://www.googleapis.com/auth/drive', // Full access to manage permissions
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/drive.readonly',
      'https://www.googleapis.com/auth/drive.metadata.readonly',
    ],
  })

  return auth
}

/**
 * Make a Google Drive file publicly viewable
 */
export async function shareFilePublicly(fileId: string) {
  const auth = getAuthClient()
  const drive = google.drive({ version: 'v3', auth })
  
  try {
    await drive.permissions.create({
      fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    })
  } catch (error) {
    console.error(`Failed to share file ${fileId}:`, error)
  }
}

/**
 * Upload a file to a specific folder on Google Drive
 */
export async function uploadDriveFile(
  name: string,
  mimeType: string,
  body: any, // stream.Readable or string
  folderId?: string
): Promise<DriveFile> {
  const config = useRuntimeConfig()
  const targetFolder = folderId || config.gdriveFolderId
  
  if (!targetFolder) {
    throw createError({ statusCode: 400, message: 'Google Drive folder ID not configured' })
  }

  const auth = getAuthClient()
  const drive = google.drive({ version: 'v3', auth })

  const response = await drive.files.create({
    requestBody: {
      name,
      mimeType,
      parents: [targetFolder],
    },
    media: {
      mimeType,
      body,
    },
    fields: 'id,name,mimeType,webViewLink,webContentLink,thumbnailLink',
  })

  const driveFile = response.data as DriveFile
  
  // Share publicly so it can be shown in the app
  await shareFilePublicly(driveFile.id)

  return driveFile
}

export async function listDriveFiles(folderId?: string): Promise<DriveFile[]> {
  const config = useRuntimeConfig()
  const targetFolder = folderId || config.gdriveFolderId

  if (!targetFolder) {
    throw createError({ statusCode: 400, message: 'Google Drive folder ID not configured' })
  }

  const auth = getAuthClient()
  const drive = google.drive({ version: 'v3', auth })

  const response = await drive.files.list({
    q: `'${targetFolder}' in parents and trashed = false`,
    fields: 'files(id,name,mimeType,size,webViewLink,webContentLink,thumbnailLink,createdTime,modifiedTime)',
    pageSize: 200,
    orderBy: 'createdTime desc',
  })

  return (response.data.files || []) as DriveFile[]
}

export async function getDriveFileInfo(fileId: string): Promise<DriveFile> {
  const auth = getAuthClient()
  const drive = google.drive({ version: 'v3', auth })

  const response = await drive.files.get({
    fileId,
    fields: 'id,name,mimeType,size,webViewLink,webContentLink,thumbnailLink,createdTime',
  })

  return response.data as DriveFile
}

export function getGalleryType(mimeType: string): 'image' | 'video' | 'other' {
  if (mimeType.startsWith('image/')) return 'image'
  if (mimeType.startsWith('video/')) return 'video'
  return 'other'
}

export function getDriveDirectUrl(fileId: string): string {
  // Direct link for download/view
  return `https://drive.google.com/uc?export=download&id=${fileId}`
}

export function getDriveThumbnailUrl(fileId: string): string {
  // Web-optimized preview link (works well for public files)
  return `https://lh3.googleusercontent.com/d/${fileId}=w800`
}
