import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/auth'
import { selectTemplatesForTheme } from '~/utils/invitation-theme-profiles'

export default defineEventHandler(async (event) => {
  const { userId } = requireAuth(event)
  const body = await readBody(event)
  const { brideName, groomName, weddingDate, theme } = body

  if (!brideName || !groomName || !weddingDate) {
    throw createError({ statusCode: 400, message: 'brideName, groomName, and weddingDate are required' })
  }

  // Fetch user to check plan
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) throw createError({ statusCode: 404, message: 'User not found' })

  // // Plan limit: free = 1 invitation max
  // if (user.plan === 'free') {
  //   const count = await prisma.invitation.count({ where: { userId } })
  //   if (count >= 1) {
  //     throw createError({
  //       statusCode: 403,
  //       message: 'Free plan is limited to 1 invitation. Please upgrade to Pro to create more.'
  //     })
  //   }
  // }

  // Pull active section templates from master table
  const templates = await prisma.sectionTemplate.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: 'asc' }
  })
  const selectedTemplates = selectTemplatesForTheme(templates, theme)

  // Generate slug from names + random suffix
  const baseSlug = `${groomName.toLowerCase().replace(/\s+/g, '-')}-${brideName.toLowerCase().replace(/\s+/g, '-')}`
  const random = Math.random().toString(36).substring(2, 7)
  const slug = `${baseSlug}-${random}`

  const invitation = await prisma.invitation.create({
    data: {
      userId,
      slug,
      brideName,
      groomName,
      weddingDate: new Date(weddingDate),
      theme: theme || 'romantic_classic',
      sections: {
        create: selectedTemplates.map((t) => ({
          type: t.type,
          title: t.title,
          enabled: t.defaultEnabled,
          displayOrder: t.displayOrder,
        }))
      }
    },
    include: { sections: true }
  })

  return invitation
})
