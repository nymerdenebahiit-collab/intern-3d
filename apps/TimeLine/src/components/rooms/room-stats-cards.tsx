import { Card } from '@/components/ui/card'
import type { Room } from '@/lib/types'
import { Building2, DoorOpen, BookOpen, Users, XCircle } from 'lucide-react'

interface RoomStatsCardsProps {
  rooms: Room[]
}

export function RoomStatsCards({ rooms }: RoomStatsCardsProps) {
  const stats = {
    total: rooms.length,
    available: rooms.filter(r => r.status === 'available').length,
    inClass: rooms.filter(r => r.status === 'class').length,
    inClub: rooms.filter(r => r.status === 'club').length,
    closed: rooms.filter(r => r.status === 'closed').length,
  }

  const statItems = [
    { label: 'Нийт өрөө', value: stats.total, icon: Building2, color: 'text-foreground bg-secondary' },
    { label: 'Нээлттэй', value: stats.available, icon: DoorOpen, color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10' },
    { label: 'Хичээлтэй', value: stats.inClass, icon: BookOpen, color: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/10' },
    { label: 'Клубтэй', value: stats.inClub, icon: Users, color: 'text-violet-600 dark:text-violet-400 bg-violet-100 dark:bg-violet-500/10' },
    { label: 'Хаалттай', value: stats.closed, icon: XCircle, color: 'text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-500/10' },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {statItems.map((item) => (
        <Card key={item.label} className="p-4">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${item.color}`}>
              <item.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{item.value}</p>
              <p className="text-xs text-muted-foreground">{item.label}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
