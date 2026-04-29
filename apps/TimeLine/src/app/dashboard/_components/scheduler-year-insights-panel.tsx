'use client'

import type { YearMonthSummary } from '@/app/dashboard/_lib/scheduler-types'
import { cn } from '@/lib/utils'

type SchedulerYearInsightsPanelProps = {
  monthName: string
  selectedYearSummary: YearMonthSummary | null
  suggestion: string
}

export function SchedulerYearInsightsPanel({ monthName, selectedYearSummary, suggestion }: SchedulerYearInsightsPanelProps) {
  const busiestRoom = selectedYearSummary?.roomLoads[0] ?? null
  const quietestRoom = selectedYearSummary?.roomLoads.at(-1) ?? null
  const capacityLabel = (selectedYearSummary?.utilization ?? 0) >= 75 ? 'Ачаалалтай' : (selectedYearSummary?.utilization ?? 0) >= 45 ? 'Дунд' : 'Сул'
  const capacityTone = (selectedYearSummary?.utilization ?? 0) >= 75 ? 'text-[#c4314b]' : (selectedYearSummary?.utilization ?? 0) >= 45 ? 'text-[#8a5a00]' : 'text-[#1f7a52]'

  return (
    <aside className="rounded-3xl border border-[#e7e9f6] bg-[linear-gradient(180deg,#ffffff_0%,#fbfbfe_100%)] p-4 shadow-sm dark:border-[#2c3149] dark:bg-[linear-gradient(180deg,#171b27_0%,#121724_100%)]">
      <div className="mb-3">
        <div className="text-lg font-semibold text-foreground">{monthName}</div>
        <div className="text-sm text-muted-foreground">{selectedYearSummary?.totalCount ?? 0} хуваарь</div>
      </div>

      <div className="mb-4 rounded-2xl border border-[#e7e9f6] bg-white/80 p-3 dark:border-[#2c3149] dark:bg-[#151a27]">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">Ачаалал</div>
        <div className={cn('mt-1 text-xl font-semibold', capacityTone)}>{selectedYearSummary?.utilization ?? 0}% {capacityLabel}</div>
      </div>

      <div className="mb-4">
        <div className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">Цагийн бүс</div>
        {([
          ['Өглөө', selectedYearSummary?.timeBuckets.morning ?? 0],
          ['Өдөр', selectedYearSummary?.timeBuckets.afternoon ?? 0],
          ['Орой', selectedYearSummary?.timeBuckets.evening ?? 0],
        ] as const).map(([label, value]) => {
          const total = Math.max(
            selectedYearSummary?.timeBuckets.morning ?? 0,
            selectedYearSummary?.timeBuckets.afternoon ?? 0,
            selectedYearSummary?.timeBuckets.evening ?? 0,
            1,
          )

          return (
            <div key={label} className="mb-2">
              <div className="mb-1 flex items-center justify-between text-[11px]">
                <span>{label}</span>
                <span>{value}</span>
              </div>
              <div className="h-1.5 rounded-full bg-[#ebeefe] dark:bg-[#232b45]">
                <div className="h-1.5 rounded-full bg-[#6264a7]" style={{ width: `${(value / total) * 100}%` }} />
              </div>
            </div>
          )
        })}
      </div>

      <div className="mb-4">
        <div className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">Ангиуд</div>
        <div className="space-y-2 text-sm">
          <div>{quietestRoom ? `${quietestRoom.roomNumber} сул` : 'Сул ангийн дата алга'}</div>
          <div>{busiestRoom ? `${busiestRoom.roomNumber} ачаалалтай` : 'Ачаалалтай ангийн дата алга'}</div>
        </div>
      </div>

      <div className="mb-4 text-sm">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">Давхцал</div>
        <div className="mt-1 font-medium text-foreground">⚠️ {selectedYearSummary?.conflictCount ?? 0} давхцал</div>
      </div>

      <div className="rounded-2xl border border-dashed border-[#d7d8f4] bg-white/70 p-3 text-sm dark:border-[#323858] dark:bg-[#111522]">
        <div className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">Санал</div>
        <div className="font-medium text-foreground">💡 {suggestion}</div>
      </div>
    </aside>
  )
}
