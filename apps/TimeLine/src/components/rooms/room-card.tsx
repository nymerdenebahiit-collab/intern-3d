'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { RoomStatusBadge } from './room-status-badge'
import type { Room } from '@/lib/types'
import { Monitor, Clock, ArrowRight, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { EVENT_TYPE_CONFIG } from '@/lib/constants'

interface RoomCardProps {
  room: Room
  showDeviceInfo?: boolean
  assignedDeviceName?: string
  compact?: boolean
}

export function RoomCard({ room, showDeviceInfo, assignedDeviceName, compact }: RoomCardProps) {
  const isAvailable = room.status === 'available'

  const cardContent = compact ? (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <RoomStatusBadge status={room.status} size="sm" />
        <div>
          <span className="font-semibold text-foreground">{room.number}</span>
          <span className="ml-2 text-xs text-muted-foreground">
            {room.floor}-р давхар
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {room.devices.length > 0 && (
          <span className="text-xs text-muted-foreground">
            {room.devices.filter(d => d.status === 'available').length}/{room.devices.length} сул
          </span>
        )}
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  ) : (
    <>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <RoomStatusBadge status={room.status} size="md" />
          <div className="text-right">
            <h3 className="text-xl font-bold text-foreground">{room.number}</h3>
            <p className="text-xs text-muted-foreground">{room.floor}-р давхар</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Current Event */}
        {room.currentEvent ? (
          <div className={cn(
            'rounded-lg border-l-4 p-3 bg-secondary/50',
            EVENT_TYPE_CONFIG[room.currentEvent.type]?.borderColor || 'border-l-muted'
          )}>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Одоо</span>
            </div>
            <p className="mt-1 font-medium text-foreground">
              {room.currentEvent.title}
            </p>
            <p className="text-xs text-muted-foreground">
              {room.currentEvent.startTime} - {room.currentEvent.endTime}
              {room.currentEvent.instructor && ` • ${room.currentEvent.instructor}`}
            </p>
          </div>
        ) : (
          <div className="rounded-lg bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 p-3">
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
              Одоо сул байна
            </p>
          </div>
        )}

        {/* Next Event */}
        {room.nextEvent && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ArrowRight className="h-3 w-3" />
            <span>
              Дараа нь: {room.nextEvent.title} ({room.nextEvent.startTime})
            </span>
          </div>
        )}

        {/* Device Info */}
        {showDeviceInfo && assignedDeviceName && (
          <div className="mt-2 rounded-lg border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/5 p-2">
            <div className="flex items-center gap-2">
              <Monitor className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm text-emerald-700 dark:text-emerald-400">
                Таны iMac: {assignedDeviceName}
              </span>
            </div>
          </div>
        )}

        {/* Device Count */}
        {room.type === 'lab' && room.devices.length > 0 && !showDeviceInfo && (
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Monitor className="h-3 w-3" />
              <span>
                {room.devices.filter(d => d.status === 'available').length}/{room.devices.length} iMac сул
              </span>
            </div>
            <ChevronRight className="h-4 w-4" />
          </div>
        )}
      </CardContent>
    </>
  )

  return (
    <Link href={`/dashboard/room/${room.id}`}>
      <Card 
        className={cn(
          'relative overflow-hidden transition-all hover:border-primary/50 hover:shadow-md cursor-pointer',
          isAvailable && 'border-emerald-300 dark:border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-500/5',
          room.status === 'class' && 'border-blue-200 dark:border-blue-500/20',
          room.status === 'club' && 'border-violet-200 dark:border-violet-500/20',
          room.status === 'closed' && 'border-rose-200 dark:border-rose-500/20 bg-rose-50/50 dark:bg-rose-500/5',
          compact && 'p-3'
        )}
      >
        {cardContent}
      </Card>
    </Link>
  )
}
