'use client'

import { getEventLabel, getEventTone } from '@/app/dashboard/_lib/scheduler-event-utils'
import type { YearMonthSummary } from '@/app/dashboard/_lib/scheduler-types'
import type { Room } from '@/lib/types'
import { cn } from '@/lib/utils'

type SchedulerYearMonthCardProps = {
  isSelected: boolean
  selectedRoomView: Room | null
  summary: YearMonthSummary
  onSelectMonth: (_date: Date) => void
}

export function SchedulerYearMonthCard({ isSelected, selectedRoomView, summary, onSelectMonth }: SchedulerYearMonthCardProps) {
  return (
    <button
      type="button"
      className={cn(
        'rounded-3xl border border-[#e7e9f6] bg-[linear-gradient(180deg,#ffffff_0%,#fbfbfe_100%)] p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-[#2c3149] dark:bg-[linear-gradient(180deg,#171b27_0%,#121724_100%)]',
        isSelected && 'ring-2 ring-inset ring-[#6264a7]',
      )}
      onClick={() => onSelectMonth(summary.monthStart)}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <div className="text-base font-semibold text-foreground">{summary.shortLabel}</div>
          <div className="text-[11px] text-muted-foreground">{summary.activeDays} идэвхтэй өдөр</div>
        </div>
        <div className="text-right">
          <div className="text-sm font-semibold text-foreground">{summary.totalCount}</div>
          <div className="text-[10px] text-muted-foreground">хуваарь</div>
        </div>
      </div>

      <div className="mb-3 flex items-center gap-2">
        <div className="h-2 flex-1 rounded-full bg-[#ebeefe] dark:bg-[#232b45]">
          <div className="h-2 rounded-full bg-[#6264a7]" style={{ width: `${summary.utilization}%` }} />
        </div>
        <span className="text-[10px] font-medium text-muted-foreground">{summary.utilization}%</span>
      </div>

      <div className="mb-3 flex flex-wrap gap-1.5">
        {summary.counts.class > 0 ? <span className="rounded-full bg-[#eaf2ff] px-2 py-1 text-[10px] font-medium text-[#17375e]">{summary.counts.class} анги</span> : null}
        {summary.counts.club > 0 ? <span className="rounded-full bg-[#f1ecff] px-2 py-1 text-[10px] font-medium text-[#3f2a76]">{summary.counts.club} клуб</span> : null}
        {summary.counts.closed > 0 ? <span className="rounded-full bg-[#fff4ce] px-2 py-1 text-[10px] font-medium text-[#5d2d00]">{summary.counts.closed} хаалттай</span> : null}
        {summary.conflictCount > 0 ? <span className="rounded-full bg-[#fde7e9] px-2 py-1 text-[10px] font-medium text-[#c4314b]">{summary.conflictCount} давхцал</span> : null}
      </div>

      <div className="space-y-1.5">
        {summary.previewEvents.length === 0 ? (
          <div className="text-[11px] text-muted-foreground">Хуваарь алга</div>
        ) : (
          summary.previewEvents.slice(0, 2).map(({ event, room }) => (
            <div
              key={`${summary.shortLabel}-${event.id}-${room?.id ?? event.roomId}`}
              className={cn('rounded-xl border px-2.5 py-2 text-[11px] shadow-sm', getEventTone(event.type))}
            >
              <div className="truncate font-semibold">{event.title}</div>
              <div className="truncate opacity-80">{selectedRoomView ? getEventLabel(event.type) : `${room?.number ?? ''} · ${getEventLabel(event.type)}`}</div>
            </div>
          ))
        )}
      </div>
    </button>
  )
}
