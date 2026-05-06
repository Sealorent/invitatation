import sharp from 'sharp'
import { prisma } from '~/server/utils/prisma'

const OG_WIDTH = 1200
const OG_HEIGHT = 630
const OG_QUALITY = 68

async function fetchImageBuffer(imageUrl: string): Promise<Buffer | null> {
  if (!imageUrl) return null

  try {
    const response = await fetch(imageUrl, {
      headers: {
        accept: 'image/*,*/*;q=0.8'
      }
    })

    if (!response.ok) return null

    const arrayBuffer = await response.arrayBuffer()
    if (!arrayBuffer.byteLength) return null

    return Buffer.from(arrayBuffer)
  } catch {
    return null
  }
}

function createFallbackBackground() {
  return Buffer.from(`
    <svg width="${OG_WIDTH}" height="${OG_HEIGHT}" viewBox="0 0 ${OG_WIDTH} ${OG_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#1b0f16" />
          <stop offset="55%" stop-color="#3a1f2b" />
          <stop offset="100%" stop-color="#7a3148" />
        </linearGradient>
        <radialGradient id="glow1" cx="30%" cy="20%" r="55%">
          <stop offset="0%" stop-color="rgba(255,215,120,0.5)" />
          <stop offset="100%" stop-color="rgba(255,215,120,0)" />
        </radialGradient>
        <radialGradient id="glow2" cx="75%" cy="80%" r="50%">
          <stop offset="0%" stop-color="rgba(255,235,180,0.35)" />
          <stop offset="100%" stop-color="rgba(255,235,180,0)" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)" />
      <rect width="100%" height="100%" fill="url(#glow1)" />
      <rect width="100%" height="100%" fill="url(#glow2)" />
    </svg>
  `)
}

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({ statusCode: 400, message: 'Missing invitation slug' })
  }

  const invitation = await prisma.invitation.findUnique({
    where: { slug },
    select: {
      brideName: true,
      groomName: true,
      coverPhoto: true,
      slug: true
    }
  })

  if (!invitation) {
    throw createError({ statusCode: 404, message: 'Invitation not found' })
  }

  const coverBuffer = await fetchImageBuffer(invitation.coverPhoto || '')
  const backgroundBuffer = coverBuffer
    ? await sharp(coverBuffer)
        .resize(OG_WIDTH, OG_HEIGHT, { fit: 'cover', position: 'center' })
        .jpeg({ quality: OG_QUALITY, mozjpeg: true, progressive: true, chromaSubsampling: '4:2:0' })
        .toBuffer()
    : await sharp(createFallbackBackground())
        .resize(OG_WIDTH, OG_HEIGHT, { fit: 'cover' })
        .jpeg({ quality: OG_QUALITY, mozjpeg: true, progressive: true, chromaSubsampling: '4:2:0' })
        .toBuffer()

  const overlay = Buffer.from(`
    <svg width="${OG_WIDTH}" height="${OG_HEIGHT}" viewBox="0 0 ${OG_WIDTH} ${OG_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="rgba(0,0,0,0.15)" />
          <stop offset="45%" stop-color="rgba(0,0,0,0.25)" />
          <stop offset="100%" stop-color="rgba(0,0,0,0.55)" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#shade)" />
    </svg>
  `)

  const image = await sharp(backgroundBuffer)
    .composite([{ input: overlay }])
    .jpeg({ quality: OG_QUALITY, mozjpeg: true, progressive: true, chromaSubsampling: '4:2:0' })
    .toBuffer()

  setHeader(event, 'Content-Type', 'image/jpeg')
  setHeader(event, 'Cache-Control', 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800')
  return image
})