'use client'

import { useState, useMemo } from 'react'
import { useRole } from '@/lib/role-context'
import { createRooms } from '@/lib/mock-data'
import type { RoomStatus } from '@/lib/types'
import { AvailableRoomsHighlight } from '@/components/rooms/available-rooms-highlight'
import { RoomStatsCards } from '@/components/rooms/room-stats-cards'
import { RoomFilterBar } from '@/components/rooms/room-filter-bar'
import { RoomCard } from '@/components/rooms/room-card'
import { DeviceCard } from '@/components/devices/device-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Monitor } from 'lucide-react'

export default function DashboardPage() {
  const { role, user } = useRole()
  const rooms = useMemo(() => createRooms(), [])

  const [selectedFloor, setSelectedFloor] = useState<'all' | 3 | 4>('all')
  const [selectedStatus, setSelectedStatus] = useState<RoomStatus | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredRooms = useMemo(() => {
    return rooms.filter(room => {
      if (selectedFloor !== 'all' && room.floor !== selectedFloor) return false
      if (selectedStatus !== 'all' && room.status !== selectedStatus) return false
      if (searchQuery && !room.number.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return true
    })
  }, [rooms, selectedFloor, selectedStatus, searchQuery])

  const floor3Rooms = filteredRooms.filter(r => r.floor === 3)
  const floor4Rooms = filteredRooms.filter(r => r.floor === 4)

  const isStudent = role === 'student'
  const userDevice = user?.assignedDevice
  const userRoom = userDevice ? rooms.find(r => r.id === userDevice.roomId) : null

  return (
    <div className="space-y-6">
      {/* Student: Available Rooms Highlight at TOP */}
      {isStudent && (
        <AvailableRoomsHighlight rooms={rooms} />
      )}

      {/* Student: Assigned Device Card */}
      {isStudent && userDevice && (
        <Card className="border-primary/30">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Monitor className="h-5 w-5 text-primary" />
              Таны төхөөрөмж байрлах анги
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row">
              <DeviceCard device={userDevice} isUserDevice />
              {userRoom && (
                <div className="flex-1">
                  <RoomCard 
                    room={userRoom} 
                    showDeviceInfo 
                    assignedDeviceName={userDevice.name}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <RoomStatsCards rooms={rooms} />

      {/* Filter Bar */}
      <RoomFilterBar
        selectedFloor={selectedFloor}
        selectedStatus={selectedStatus}
        searchQuery={searchQuery}
        onFloorChange={setSelectedFloor}
        onStatusChange={setSelectedStatus}
        onSearchChange={setSearchQuery}
      />

      {/* Room Grid - Grouped by Floor */}
      <div className="space-y-8">
        {/* 3rd Floor */}
        {(selectedFloor === 'all' || selectedFloor === 3) && floor3Rooms.length > 0 && (
          <section>
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
              <span className="h-6 w-1 rounded-full bg-primary" />
              3-р давхар
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({floor3Rooms.length} өрөө)
              </span>
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {floor3Rooms.map(room => (
                <RoomCard 
                  key={room.id} 
                  room={room}
                  showDeviceInfo={isStudent && userDevice?.roomId === room.id}
                  assignedDeviceName={userDevice?.roomId === room.id ? userDevice.name : undefined}
                />
              ))}
            </div>
          </section>
        )}

        {/* 4th Floor */}
        {(selectedFloor === 'all' || selectedFloor === 4) && floor4Rooms.length > 0 && (
          <section>
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
              <span className="h-6 w-1 rounded-full bg-violet-500" />
              4-р давхар
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({floor4Rooms.length} өрөө)
              </span>
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {floor4Rooms.map(room => (
                <RoomCard 
                  key={room.id} 
                  room={room}
                  showDeviceInfo={isStudent && userDevice?.roomId === room.id}
                  assignedDeviceName={userDevice?.roomId === room.id ? userDevice.name : undefined}
                />
              ))}
            </div>
          </section>
        )}

        {/* No Results */}
        {filteredRooms.length === 0 && (
          <div className="rounded-lg border border-dashed border-border p-8 text-center">
            <p className="text-muted-foreground">
              Хайлтын үр дүн олдсонгүй
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
