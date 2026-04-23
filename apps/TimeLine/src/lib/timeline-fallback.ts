import type { DeviceAssignmentRow, RoomRow, ScheduleOverrideRow, ScheduleRow } from '@/db/schema'
import { mapDeviceAssignmentRow, mapRoomRow, mapScheduleOverrideRow, mapScheduleRow } from '@/lib/timeline-mappers'

const FALLBACK_CREATED_AT = '2026-04-01T00:00:00.000Z'
const FALLBACK_CREATED_BY = 'admin-1'

const fallbackRooms: RoomRow[] = [
  { id: 'room-301', name: '301', floor: 3, type: 'lab', capacity: 32, createdAt: FALLBACK_CREATED_AT },
  { id: 'room-302', name: '302', floor: 3, type: 'lab', capacity: 28, createdAt: FALLBACK_CREATED_AT },
  { id: 'room-303', name: '303', floor: 3, type: 'lab', capacity: 30, createdAt: FALLBACK_CREATED_AT },
  { id: 'room-304', name: '304', floor: 3, type: 'lab', capacity: 26, createdAt: FALLBACK_CREATED_AT },
  { id: 'room-305', name: '305', floor: 3, type: 'lab', capacity: 24, createdAt: FALLBACK_CREATED_AT },
  { id: 'room-401', name: '401', floor: 4, type: 'lab', capacity: 36, createdAt: FALLBACK_CREATED_AT },
  { id: 'room-402', name: '402', floor: 4, type: 'event_hall', capacity: 80, createdAt: FALLBACK_CREATED_AT },
  { id: 'room-403', name: '403', floor: 4, type: 'lab', capacity: 34, createdAt: FALLBACK_CREATED_AT },
]

const fallbackSchedules: ScheduleRow[] = [
  {
    id: 'schedule-physics-101',
    roomId: 'room-301',
    title: 'Physics 101',
    type: 'class',
    daysOfWeek: JSON.stringify([1, 3, 5]),
    startTime: '08:00',
    endTime: '09:30',
    startDate: '2026-01-12',
    endDate: '2026-12-18',
    createdBy: FALLBACK_CREATED_BY,
    createdAt: FALLBACK_CREATED_AT,
  },
  {
    id: 'schedule-open-study-lab',
    roomId: 'room-302',
    title: 'Open Study Lab',
    type: 'open',
    daysOfWeek: JSON.stringify([1, 2, 3, 4, 5]),
    startTime: '09:00',
    endTime: '12:00',
    startDate: '2026-01-12',
    endDate: '2026-12-18',
    createdBy: FALLBACK_CREATED_BY,
    createdAt: FALLBACK_CREATED_AT,
  },
  {
    id: 'schedule-advanced-math',
    roomId: 'room-401',
    title: 'Advanced Mathematics',
    type: 'class',
    daysOfWeek: JSON.stringify([1, 3, 5]),
    startTime: '13:00',
    endTime: '14:30',
    startDate: '2026-01-12',
    endDate: '2026-12-18',
    createdBy: FALLBACK_CREATED_BY,
    createdAt: FALLBACK_CREATED_AT,
  },
  {
    id: 'schedule-robotics-club',
    roomId: 'room-303',
    title: 'Robotics Club',
    type: 'club',
    daysOfWeek: JSON.stringify([2, 4]),
    startTime: '15:30',
    endTime: '17:00',
    startDate: '2026-01-12',
    endDate: '2026-12-18',
    createdBy: FALLBACK_CREATED_BY,
    createdAt: FALLBACK_CREATED_AT,
  },
  {
    id: 'schedule-open-access-304',
    roomId: 'room-304',
    title: 'Open Access 304',
    type: 'open',
    daysOfWeek: JSON.stringify([1, 2, 3, 4, 5]),
    startTime: '13:00',
    endTime: '16:00',
    startDate: '2026-01-12',
    endDate: '2026-12-18',
    createdBy: FALLBACK_CREATED_BY,
    createdAt: FALLBACK_CREATED_AT,
  },
  {
    id: 'schedule-weekend-open-305',
    roomId: 'room-305',
    title: 'Weekend Open Access',
    type: 'open',
    daysOfWeek: JSON.stringify([6]),
    startTime: '10:00',
    endTime: '14:00',
    startDate: '2026-01-12',
    endDate: '2026-12-18',
    createdBy: FALLBACK_CREATED_BY,
    createdAt: FALLBACK_CREATED_AT,
  },
  {
    id: 'schedule-debate-society',
    roomId: 'room-402',
    title: 'Debate Society',
    type: 'club',
    daysOfWeek: JSON.stringify([3, 5]),
    startTime: '16:00',
    endTime: '17:30',
    startDate: '2026-01-12',
    endDate: '2026-12-18',
    createdBy: FALLBACK_CREATED_BY,
    createdAt: FALLBACK_CREATED_AT,
  },
  {
    id: 'schedule-programming-403',
    roomId: 'room-403',
    title: 'Programming Workshop',
    type: 'class',
    daysOfWeek: JSON.stringify([1, 4]),
    startTime: '11:00',
    endTime: '12:30',
    startDate: '2026-01-12',
    endDate: '2026-12-18',
    createdBy: FALLBACK_CREATED_BY,
    createdAt: FALLBACK_CREATED_AT,
  },
]

const fallbackOverrides: ScheduleOverrideRow[] = [
  {
    id: 'override-301-maintenance',
    roomId: 'room-301',
    date: '2026-04-24',
    startTime: '08:00',
    endTime: '12:00',
    type: 'closed',
    title: 'Projector Maintenance',
    createdBy: FALLBACK_CREATED_BY,
    createdAt: FALLBACK_CREATED_AT,
  },
]

const fallbackDevices: DeviceAssignmentRow[] = [
  { id: 'room-301-device-1', roomId: 'room-301', deviceName: 'iMac-01', userId: 'student-1' },
  { id: 'room-301-device-2', roomId: 'room-301', deviceName: 'iMac-02', userId: null },
  { id: 'room-302-device-1', roomId: 'room-302', deviceName: 'iMac-01', userId: null },
  { id: 'room-303-device-1', roomId: 'room-303', deviceName: 'iMac-01', userId: null },
  { id: 'room-304-device-1', roomId: 'room-304', deviceName: 'iMac-01', userId: null },
  { id: 'room-305-device-1', roomId: 'room-305', deviceName: 'iMac-01', userId: null },
  { id: 'room-401-device-1', roomId: 'room-401', deviceName: 'iMac-01', userId: null },
  { id: 'room-402-device-1', roomId: 'room-402', deviceName: 'iMac-01', userId: null },
  { id: 'room-403-device-1', roomId: 'room-403', deviceName: 'iMac-01', userId: null },
]

function buildFallback(now = new Date()) {
  const events = [...fallbackSchedules.map(mapScheduleRow), ...fallbackOverrides.map(mapScheduleOverrideRow)].sort((left, right) => {
    if (left.roomId !== right.roomId) return left.roomId.localeCompare(right.roomId)
    return left.startTime.localeCompare(right.startTime)
  })

  const rooms = [...fallbackRooms]
    .sort((left, right) => {
      if (left.floor !== right.floor) return left.floor - right.floor
      return left.name.localeCompare(right.name)
    })
    .map((room) => {
      const devices = fallbackDevices
        .filter((device) => device.roomId === room.id)
        .map((device) => mapDeviceAssignmentRow(device, room.name))

      return mapRoomRow(
        room,
        events.filter((event) => event.roomId === room.id),
        devices,
        now
      )
    })

  return { rooms, events }
}

export function listFallbackRooms(params: { floor?: string | null; status?: string | null; search?: string | null } = {}) {
  const { rooms } = buildFallback()

  return rooms.filter((room) => {
    if (params.floor && room.floor !== Number(params.floor)) return false
    if (params.status && room.status !== params.status) return false
    if (params.search && !room.number.toLowerCase().includes(params.search.toLowerCase())) return false
    return true
  })
}

export function getFallbackRoomDetail(roomId: string) {
  const { rooms, events } = buildFallback()
  const room = rooms.find((entry) => entry.id === roomId)
  if (!room) return null

  return {
    room,
    events: events.filter((event) => event.roomId === roomId),
  }
}

export function listFallbackScheduleEvents(params: { roomId?: string | null; dayOfWeek?: string | null; instructor?: string | null } = {}) {
  if (params.instructor) return []

  const { events } = buildFallback()

  return events.filter((event) => {
    if (params.roomId && event.roomId !== params.roomId) return false
    if (params.dayOfWeek && !event.daysOfWeek.includes(Number(params.dayOfWeek))) return false
    return true
  })
}
