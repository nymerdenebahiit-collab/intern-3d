import { and, asc, eq, inArray, like, sql } from 'drizzle-orm'
import { getDrizzleDb } from '@/db/client'
import { devicesTable, roomsTable, scheduleEventsTable, type DeviceRow, type RoomRow, type ScheduleEventRow } from '@/db/schema'
import { createRooms, scheduleEvents as mockScheduleEvents } from '@/lib/mock-data'
import type { Device, EventType, Room, RoomStatus, ScheduleEvent } from '@/lib/types'

const DEMO_DAY = 2
const DEMO_TIME_MINUTES = 10 * 60 + 30

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

function mapEventRow(event: ScheduleEventRow): ScheduleEvent {
  return {
    id: event.id,
    roomId: event.roomId,
    title: event.title,
    type: event.type as EventType,
    startTime: event.startTime,
    endTime: event.endTime,
    dayOfWeek: event.dayOfWeek ?? JSON.parse(event.daysOfWeek)[0] ?? 0,
    daysOfWeek: JSON.parse(event.daysOfWeek) as number[],
    date: event.date ?? undefined,
    isOverride: Boolean(event.isOverride),
    instructor: event.instructor ?? undefined,
    notes: event.notes ?? undefined,
    validFrom: event.validFrom ?? undefined,
    validUntil: event.validUntil ?? undefined,
  }
}

function mapDeviceRow(device: DeviceRow): Device {
  return {
    id: device.id,
    name: device.name,
    roomId: device.roomId,
    roomNumber: device.roomNumber,
    status: device.status as Device['status'],
    assignedTo: device.assignedTo ?? undefined,
  }
}

function findCurrentEvent(events: ScheduleEvent[], roomId: string): ScheduleEvent | null {
  const roomEvents = events.filter(event => event.roomId === roomId && event.daysOfWeek.includes(DEMO_DAY))
  return roomEvents.find(event => DEMO_TIME_MINUTES >= timeToMinutes(event.startTime) && DEMO_TIME_MINUTES < timeToMinutes(event.endTime)) ?? null
}

function findNextEvent(events: ScheduleEvent[], roomId: string): ScheduleEvent | null {
  return (
    events
      .filter(event => event.roomId === roomId && event.daysOfWeek.includes(DEMO_DAY))
      .filter(event => timeToMinutes(event.startTime) > DEMO_TIME_MINUTES)
      .sort((left, right) => timeToMinutes(left.startTime) - timeToMinutes(right.startTime))[0] ?? null
  )
}

function mapRoomRow(room: RoomRow, events: ScheduleEvent[], devices: Device[]): Room {
  return {
    id: room.id,
    number: room.number,
    floor: room.floor as Room['floor'],
    type: room.type as Room['type'],
    status: room.status as RoomStatus,
    currentEvent: findCurrentEvent(events, room.id),
    nextEvent: findNextEvent(events, room.id),
    devices,
  }
}

export async function listRooms(params: { floor?: string | null; status?: string | null; search?: string | null } = {}) {
  const db = getDrizzleDb()
  const filters = []

  if (params.floor) filters.push(eq(roomsTable.floor, Number(params.floor)))
  if (params.status) filters.push(eq(roomsTable.status, params.status))
  if (params.search) filters.push(like(roomsTable.number, `%${params.search}%`))

  const rooms = await db
    .select()
    .from(roomsTable)
    .where(filters.length > 0 ? and(...filters) : undefined)
    .orderBy(asc(roomsTable.floor), asc(roomsTable.number))

  const roomIds = rooms.map(room => room.id)
  const [events, devices] = roomIds.length === 0
    ? [[], []]
    : await Promise.all([
        db.select().from(scheduleEventsTable).where(inArray(scheduleEventsTable.roomId, roomIds)).orderBy(asc(scheduleEventsTable.startTime)),
        db.select().from(devicesTable).where(inArray(devicesTable.roomId, roomIds)).orderBy(asc(devicesTable.name)),
      ])

  const mappedEvents = events.map(mapEventRow)
  const mappedDevices = devices.map(mapDeviceRow)

  return rooms.map(room =>
    mapRoomRow(
      room,
      mappedEvents.filter(event => event.roomId === room.id),
      mappedDevices.filter(device => device.roomId === room.id)
    )
  )
}

export async function getRoomDetail(roomId: string) {
  const db = getDrizzleDb()
  const [room] = await db.select().from(roomsTable).where(eq(roomsTable.id, roomId)).limit(1)
  if (!room) return null

  const [events, devices] = await Promise.all([
    db.select().from(scheduleEventsTable).where(eq(scheduleEventsTable.roomId, roomId)).orderBy(asc(scheduleEventsTable.startTime)),
    db.select().from(devicesTable).where(eq(devicesTable.roomId, roomId)).orderBy(asc(devicesTable.name)),
  ])

  const mappedEvents = events.map(mapEventRow)
  const mappedDevices = devices.map(mapDeviceRow)

  return {
    room: mapRoomRow(room, mappedEvents, mappedDevices),
    events: mappedEvents,
  }
}

export async function listScheduleEvents(params: { roomId?: string | null; dayOfWeek?: string | null; instructor?: string | null } = {}) {
  const db = getDrizzleDb()
  const filters = []

  if (params.roomId) filters.push(eq(scheduleEventsTable.roomId, params.roomId))
  if (params.instructor) filters.push(like(scheduleEventsTable.instructor, `%${params.instructor}%`))
  if (params.dayOfWeek) filters.push(like(scheduleEventsTable.daysOfWeek, `%${params.dayOfWeek}%`))

  const events = await db
    .select()
    .from(scheduleEventsTable)
    .where(filters.length > 0 ? and(...filters) : undefined)
    .orderBy(asc(scheduleEventsTable.roomId), asc(scheduleEventsTable.startTime))

  return events.map(mapEventRow)
}

export async function seedTimelineDatabase(options: { reset?: boolean } = {}) {
  const db = getDrizzleDb()

  if (options.reset) {
    await db.delete(devicesTable)
    await db.delete(scheduleEventsTable)
    await db.delete(roomsTable)
  }

  const existingRooms = await db.select({ count: sql<number>`count(*)` }).from(roomsTable)
  if ((existingRooms[0]?.count ?? 0) > 0 && !options.reset) {
    return { seeded: false, reason: 'rooms already exist' as const }
  }

  const rooms = createRooms()
  const now = new Date().toISOString()

  await db.insert(roomsTable).values(
    rooms.map(room => ({
      id: room.id,
      number: room.number,
      floor: room.floor,
      type: room.type,
      status: room.status,
      createdAt: now,
      updatedAt: now,
    }))
  )

  await db.insert(scheduleEventsTable).values(
    mockScheduleEvents.map(event => ({
      id: event.id,
      roomId: event.roomId,
      title: event.title,
      type: event.type,
      startTime: event.startTime,
      endTime: event.endTime,
      dayOfWeek: event.dayOfWeek,
      daysOfWeek: JSON.stringify(event.daysOfWeek),
      date: event.date ?? null,
      isOverride: event.isOverride ? 1 : 0,
      instructor: event.instructor ?? null,
      notes: event.notes ?? null,
      validFrom: event.validFrom ?? null,
      validUntil: event.validUntil ?? null,
      createdAt: now,
      updatedAt: now,
    }))
  )

  const devices = rooms.flatMap(room => room.devices)
  if (devices.length > 0) {
    await db.insert(devicesTable).values(
      devices.map(device => ({
        id: device.id,
        name: device.name,
        roomId: device.roomId,
        roomNumber: device.roomNumber,
        status: device.status,
        assignedTo: device.assignedTo ?? null,
        createdAt: now,
        updatedAt: now,
      }))
    )
  }

  return {
    seeded: true,
    rooms: rooms.length,
    events: mockScheduleEvents.length,
    devices: devices.length,
  }
}
