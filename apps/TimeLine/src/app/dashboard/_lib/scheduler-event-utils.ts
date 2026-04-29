import { DAY_MINUTES, WORK_DAYS } from '@/app/dashboard/_lib/scheduler-constants'
import { addDays, formatMonthShortLabel, getDayOfWeekValue, getMonthDaysInMonth, isSameMonth, toIsoDate } from '@/app/dashboard/_lib/scheduler-date-utils'
import { timeToMinutes } from '@/app/dashboard/_lib/scheduler-time-utils'
import type { MonthSummary, MonthViewFilter, TimelineCounts, TimelineOccurrence, YearMonthSummary } from '@/app/dashboard/_lib/scheduler-types'
import type { EventType, Room, ScheduleEvent } from '@/lib/types'

export function eventOccursInWeekOnDay(event: ScheduleEvent, dayOfWeek: number, dayDate: string): boolean {
  return event.isOverride ? event.date === dayDate : event.daysOfWeek.includes(dayOfWeek) && (!event.validFrom || event.validFrom <= dayDate) && (!event.validUntil || event.validUntil >= dayDate)
}

export function getEventTone(type: EventType) {
  if (type === 'class') return 'border-l-[#2564cf] bg-[#dfe9ff] text-[#163760]'
  if (type === 'club') return 'border-l-[#7f5ccf] bg-[#f0e9ff] text-[#3b2468]'
  if (type === 'closed') return 'border-l-[#d83b01] bg-[#fff0eb] text-[#672100]'
  return 'border-l-[#0f8f5f] bg-[#e8fff5] text-[#0f5132]'
}

export function getEventLabel(type: EventType) {
  if (type === 'class') return 'Анги'
  if (type === 'club') return 'Клуб'
  if (type === 'closed') return 'Хаалттай'
  return 'Нээлттэй'
}

export function shouldRenderTimelineEvent(event: ScheduleEvent) {
  return event.type === 'class' || event.type === 'club' || event.type === 'closed'
}

export function createEmptyTimelineCounts(): TimelineCounts {
  return { class: 0, club: 0, closed: 0 }
}

export function getMonthViewOccurrencesForDate(events: ScheduleEvent[], scopedRoomIds: Set<string>, roomLookup: Map<string, Room>, date: Date): TimelineOccurrence[] {
  const dayOfWeek = getDayOfWeekValue(date)
  const dateIso = toIsoDate(date)
  return events.filter((event) => scopedRoomIds.has(event.roomId) && eventOccursInWeekOnDay(event, dayOfWeek, dateIso)).sort((left, right) => left.startTime.localeCompare(right.startTime)).map((event) => ({ event, room: roomLookup.get(event.roomId) ?? null }))
}

export function hasMonthViewConflict(occurrences: Array<{ event: ScheduleEvent }>) {
  return occurrences.some((occurrence, index) => occurrences.slice(index + 1).some((candidate) => occurrence.event.startTime < candidate.event.endTime && occurrence.event.endTime > candidate.event.startTime))
}

export function buildMonthSummaries(calendarMonth: Date, events: ScheduleEvent[], monthDays: Date[], roomLookup: Map<string, Room>, scopedRoomIds: Set<string>): MonthSummary[] {
  return monthDays.map((date) => {
    const occurrences = getMonthViewOccurrencesForDate(events, scopedRoomIds, roomLookup, date)
    const counts = occurrences.reduce<TimelineCounts>((acc, occurrence) => {
      if (occurrence.event.type === 'class' || occurrence.event.type === 'club' || occurrence.event.type === 'closed') acc[occurrence.event.type] += 1
      return acc
    }, createEmptyTimelineCounts())
    return { date, dateIso: toIsoDate(date), isCurrentMonth: isSameMonth(date, calendarMonth), isWeekend: date.getDay() === 0 || date.getDay() === 6, occurrences, counts, totalCount: occurrences.length, hasConflict: hasMonthViewConflict(occurrences) }
  })
}

export function createMonthFilterTotals(monthSummaries: MonthSummary[]) {
  return monthSummaries.reduce<Record<'all' | 'class' | 'club' | 'closed', number>>((acc, summary) => {
    if (!summary.isCurrentMonth) return acc
    acc.all += summary.totalCount
    acc.class += summary.counts.class
    acc.club += summary.counts.club
    acc.closed += summary.counts.closed
    return acc
  }, { all: 0, class: 0, club: 0, closed: 0 })
}

export function getWeekDates(weekStart: Date) {
  return WORK_DAYS.map((day) => toIsoDate(addDays(weekStart, day.value - 1)))
}

export function getEventDurationMinutes(event: ScheduleEvent) {
  return Math.max(0, timeToMinutes(event.endTime) - timeToMinutes(event.startTime))
}

export function getTimeBucket(event: ScheduleEvent): 'morning' | 'afternoon' | 'evening' {
  const startMinutes = timeToMinutes(event.startTime)
  if (startMinutes < 12 * 60) return 'morning'
  if (startMinutes < 17 * 60) return 'afternoon'
  return 'evening'
}

export function buildYearSummaries(params: {
  yearMonths: Date[]
  events: ScheduleEvent[]
  roomLookup: Map<string, Room>
  roomsForFocusedView: Room[]
  scopedRoomIds: Set<string>
  yearFilter: MonthViewFilter
}): YearMonthSummary[] {
  const { yearMonths, events, roomLookup, roomsForFocusedView, scopedRoomIds, yearFilter } = params

  return yearMonths.map((monthStart) => {
    const monthDaySummaries = getMonthDaysInMonth(monthStart).map((date) => {
      const occurrences = getMonthViewOccurrencesForDate(events, scopedRoomIds, roomLookup, date)
      const filteredOccurrences = yearFilter === 'all' ? occurrences : occurrences.filter((occurrence) => occurrence.event.type === yearFilter)
      const counts = filteredOccurrences.reduce<TimelineCounts>((accumulator, occurrence) => {
        if (occurrence.event.type === 'class' || occurrence.event.type === 'club' || occurrence.event.type === 'closed') {
          accumulator[occurrence.event.type] += 1
        }
        return accumulator
      }, createEmptyTimelineCounts())

      return {
        date,
        dateIso: toIsoDate(date),
        isCurrentMonth: true,
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
        occurrences: filteredOccurrences,
        counts,
        totalCount: filteredOccurrences.length,
        hasConflict: hasMonthViewConflict(filteredOccurrences),
      }
    })

    const counts = monthDaySummaries.reduce<TimelineCounts>(
      (accumulator, summary) => ({
        class: accumulator.class + summary.counts.class,
        club: accumulator.club + summary.counts.club,
        closed: accumulator.closed + summary.counts.closed,
      }),
      createEmptyTimelineCounts(),
    )
    const totalCount = monthDaySummaries.reduce((accumulator, summary) => accumulator + summary.totalCount, 0)
    const activeDays = monthDaySummaries.filter((summary) => summary.totalCount > 0).length
    const hasConflict = monthDaySummaries.some((summary) => summary.hasConflict)
    const conflictCount = monthDaySummaries.filter((summary) => summary.hasConflict).length
    const totalScheduledMinutes = monthDaySummaries.reduce(
      (accumulator, summary) => accumulator + summary.occurrences.reduce((sum, occurrence) => sum + getEventDurationMinutes(occurrence.event), 0),
      0,
    )
    const maxPossibleMinutes = Math.max(roomsForFocusedView.length, 1) * monthDaySummaries.length * DAY_MINUTES
    const utilization = maxPossibleMinutes > 0 ? Math.min(100, Math.round((totalScheduledMinutes / maxPossibleMinutes) * 100)) : 0
    const previewMap = new Map<string, TimelineOccurrence>()
    const timeBuckets = { morning: 0, afternoon: 0, evening: 0 }
    const roomLoadMap = new Map<string, { roomId: string; roomNumber: string; totalCount: number }>()

    monthDaySummaries.forEach((summary) => {
      summary.occurrences.forEach((occurrence) => {
        const key = `${occurrence.event.id}-${occurrence.room?.id ?? occurrence.event.roomId}`
        if (!previewMap.has(key)) previewMap.set(key, occurrence)
        timeBuckets[getTimeBucket(occurrence.event)] += 1

        const roomId = occurrence.room?.id ?? occurrence.event.roomId
        const roomNumber = occurrence.room?.number ?? occurrence.event.roomId
        const current = roomLoadMap.get(roomId)
        roomLoadMap.set(roomId, {
          roomId,
          roomNumber,
          totalCount: (current?.totalCount ?? 0) + 1,
        })
      })
    })

    return {
      monthStart,
      shortLabel: formatMonthShortLabel(monthStart),
      totalCount,
      counts,
      activeDays,
      utilization,
      hasConflict,
      conflictCount,
      previewEvents: Array.from(previewMap.values()).slice(0, 3),
      timeBuckets,
      roomLoads: Array.from(roomLoadMap.values()).sort((left, right) => right.totalCount - left.totalCount),
    }
  })
}

export function createYearFilterTotals(yearSummaries: YearMonthSummary[]) {
  return {
    all: yearSummaries.reduce((sum, summary) => sum + summary.totalCount, 0),
    class: yearSummaries.reduce((sum, summary) => sum + summary.counts.class, 0),
    club: yearSummaries.reduce((sum, summary) => sum + summary.counts.club, 0),
    closed: yearSummaries.reduce((sum, summary) => sum + summary.counts.closed, 0),
  }
}
