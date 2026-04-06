import { prisma } from '~/server/utils/prisma'
import { requireAdmin } from '~/server/utils/admin'

// GET /api/admin/stats — dashboard stats
export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const [totalUsers, totalInvitations, totalRsvps, totalViews] = await Promise.all([
    prisma.user.count(),
    prisma.invitation.count(),
    prisma.rsvp.count(),
    prisma.analytics.count(),
  ])

  const planBreakdown = await prisma.user.groupBy({
    by: ['plan'],
    _count: true,
  })

  const recentUsers = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: { id: true, name: true, email: true, plan: true, role: true, createdAt: true }
  })

  return {
    totalUsers,
    totalInvitations,
    totalRsvps,
    totalViews,
    planBreakdown,
    recentUsers,
  }
})
