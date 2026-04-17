'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RoomCard } from './room-card'
import type { Room } from '@/lib/types'
import { Sparkles } from 'lucide-react'

interface AvailableRoomsHighlightProps {
  rooms: Room[]
}

export function AvailableRoomsHighlight({ rooms }: AvailableRoomsHighlightProps) {
  // "available" status now includes both free rooms and open lab periods
  const availableRooms = rooms.filter(room => room.status === 'available')

  if (availableRooms.length === 0) {
    return (
      <Card className="border-amber-300 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base text-amber-700 dark:text-amber-400">
            <Sparkles className="h-5 w-5" />
            яг одоо сул ангиуд
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Одоогоор бүх анги завгүй байна. Удалгүй сулрах ангиудыг доор харна уу.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-emerald-300 dark:border-emerald-500/30 bg-gradient-to-br from-emerald-50 dark:from-emerald-500/10 to-emerald-100/50 dark:to-emerald-500/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/30">
            <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <span className="text-emerald-700 dark:text-emerald-400">яг одоо сул ангиуд</span>
          <span className="ml-auto rounded-full bg-emerald-100 dark:bg-emerald-500/20 px-2.5 py-0.5 text-sm font-medium text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
            {availableRooms.length}
          </span>
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-1">
          Эдгээр ангиуд одоо нээлттэй байна (Open Lab болон сул цаг)
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {availableRooms.map(room => (
            <RoomCard key={room.id} room={room} compact />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
