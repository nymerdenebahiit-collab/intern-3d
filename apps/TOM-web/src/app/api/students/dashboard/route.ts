import { NextRequest } from 'next/server'

import { getCurrentUserFromRequest } from '@/lib/tom-auth'
import {
  listClubMembershipsForUser,
  listClubsByIds,
  listClubRequests,
  listEventsForUser,
} from '@/lib/tom-db'
import { forbidden, ok, serverError, unauthorized } from '@/lib/tom-http'

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUserFromRequest(request, true)
    if (!currentUser) return unauthorized('Session not found.')
    if (currentUser.role !== 'student') {
      return forbidden('Only students can access the student dashboard.')
    }

    const memberships = await listClubMembershipsForUser(currentUser.id)
    const joinedClubIds = memberships.map((membership) => membership.clubId)

    const [clubs, requests, events] = await Promise.all([
      listClubsByIds(joinedClubIds),
      listClubRequests({
        createdBy: currentUser.name,
      }),
      listEventsForUser(currentUser.id),
    ])

    return ok({
      user: currentUser,
      joinedClubIds,
      clubs,
      requests,
      events,
    })
  } catch (error) {
    return serverError('Failed to load student dashboard.', String(error))
  }
}
