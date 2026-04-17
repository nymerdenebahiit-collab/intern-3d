import { Card } from '@/components/ui/card'
import type { Device } from '@/lib/types'
import { Monitor } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DeviceCardProps {
  device: Device
  isUserDevice?: boolean
}

export function DeviceCard({ device, isUserDevice }: DeviceCardProps) {
  const statusColors = {
    available: 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20',
    assigned: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20',
    maintenance: 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20',
  }

  const statusLabels = {
    available: 'Сул',
    assigned: isUserDevice ? 'Танд хуваарилагдсан' : 'Хуваарилагдсан',
    maintenance: 'Засвартай',
  }

  return (
    <Card 
      className={cn(
        'p-3 transition-all',
        isUserDevice && 'border-emerald-300 dark:border-emerald-500/40 bg-emerald-50 dark:bg-emerald-500/5'
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          'flex h-10 w-10 items-center justify-center rounded-lg border',
          statusColors[device.status]
        )}>
          <Monitor className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-foreground truncate">
              {device.name}
            </h4>
            {isUserDevice && (
              <span className="shrink-0 rounded-full bg-emerald-100 dark:bg-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
                Таных
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Анги: {device.roomNumber}
          </p>
          <div className="mt-1 flex items-center gap-1.5">
            <span className={cn(
              'h-1.5 w-1.5 rounded-full',
              device.status === 'available' ? 'bg-emerald-500' :
              device.status === 'assigned' ? 'bg-blue-500' : 'bg-amber-500'
            )} />
            <span className="text-xs text-muted-foreground">
              {statusLabels[device.status]}
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
}
