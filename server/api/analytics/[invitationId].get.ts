import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/auth'

type AnalyticsRecord = {
  id: string
  invitationId: string
  visitorIp: string | null
  userAgent: string | null
  guestName: string | null
  visitTime: Date
}

export default defineEventHandler(async (event) => {
  const { userId } = requireAuth(event)
  const invitationId = getRouterParam(event, 'invitationId')!

  const invitation = await prisma.invitation.findFirst({ where: { id: invitationId, userId } })
  if (!invitation) throw createError({ statusCode: 404, message: 'Not found' })

  const analytics: AnalyticsRecord[] = await prisma.analytics.findMany({
    where: { invitationId },
    orderBy: { visitTime: 'desc' },
    take: 100
  })

  const totalViews = analytics.length
  const uniqueIps = new Set(analytics.map((a: AnalyticsRecord) => a.visitorIp)).size

  // Views by day (last 30 days)
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const recentViews = analytics.filter((a: AnalyticsRecord) => a.visitTime >= thirtyDaysAgo)

  const viewsByDay: Record<string, number> = {}
  recentViews.forEach((a: AnalyticsRecord) => {
    const day = a.visitTime.toISOString().split('T')[0]!
    viewsByDay[day] = (viewsByDay[day] || 0) + 1
  })

  const rsvpStats = await prisma.rsvp.groupBy({
    by: ['attendance'],
    where: { invitationId },
    _count: true
  })

  return {
    totalViews,
    uniqueVisitors: uniqueIps,
    viewsByDay,
    rsvpStats,
    recentViews: analytics.slice(0, 20)
  }
})
