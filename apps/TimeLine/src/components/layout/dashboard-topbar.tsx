'use client'

import { useRole } from '@/lib/role-context'
import { Badge } from '@/components/ui/badge'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { ThemeToggle } from '@/components/theme-toggle'

export function DashboardTopbar() {
  const { role } = useRole()

  const now = new Date()
  const formattedDate = now.toLocaleDateString('mn-MN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const formattedTime = now.toLocaleTimeString('mn-MN', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-6" />
      
      <div className="flex flex-1 items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            {formattedDate}
          </span>
          <Badge variant="outline" className="text-xs font-mono">
            {formattedTime}
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Badge 
            variant="secondary"
            className={`${
              role === 'admin' 
                ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30' 
                : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30'
            }`}
          >
            {role === 'admin' ? 'Админ горим' : 'Сурагч горим'}
          </Badge>
        </div>
      </div>
    </header>
  )
}
