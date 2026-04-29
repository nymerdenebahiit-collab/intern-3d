'use client'

import { formatMonthLabel } from '@/app/dashboard/_lib/scheduler-date-utils'
import { getEventLabel, getEventTone } from '@/app/dashboard/_lib/scheduler-event-utils'
import type { MonthViewFilter, YearMonthSummary } from '@/app/dashboard/_lib/scheduler-types'
import type { Room } from '@/lib/types'
import { cn } from '@/lib/utils'

type SchedulerYearOverviewViewProps = {
  calendarMonth: Date
  selectedYearSummary: YearMonthSummary | null
  selectedRoomView: Room | null
  yearFilter: MonthViewFilter
  yearFilterTotals: Record<MonthViewFilter, number>
  yearSummaries: YearMonthSummary[]
  onFilterChange: (_filter: MonthViewFilter) => void
  onSelectMonth: (_date: Date) => void
}

const filterOptions: Array<{ key: MonthViewFilter; label: string }> = [
  { key: 'all', label: 'Бүгд' },
  { key: 'class', label: 'Анги' },
  { key: 'club', label: 'Клуб' },
  { key: 'closed', label: 'Хаалттай' },
]

export function SchedulerYearOverviewView({
  calendarMonth,
  selectedYearSummary,
  selectedRoomView,
  yearFilter,
  yearFilterTotals,
  yearSummaries,
  onFilterChange,
  onSelectMonth,
}: SchedulerYearOverviewViewProps) {
  const busiestRoom = selectedYearSummary?.roomLoads[0] ?? null
  const quietestRoom = selectedYearSummary?.roomLoads.at(-1) ?? null
  const monthName = selectedYearSummary ? formatMonthLabel(selectedYearSummary.monthStart) : 'Сар сонгоно уу'
  const capacityLabel = (selectedYearSummary?.utilization ?? 0) >= 75 ? 'Ачаалалтай' : (selectedYearSummary?.utilization ?? 0) >= 45 ? 'Дунд' : 'Сул'
  const capacityTone = (selectedYearSummary?.utilization ?? 0) >= 75 ? 'text-[#c4314b]' : (selectedYearSummary?.utilization ?? 0) >= 45 ? 'text-[#8a5a00]' : 'text-[#1f7a52]'
  const suggestion = !selectedYearSummary || selectedYearSummary.totalCount === 0
    ? 'Одоогоор дата алга'
    : selectedYearSummary.conflictCount > 0
      ? 'Шинэ давтамжтай хуваарь нэмэхээс өмнө давхцлыг шалгаарай'
      : selectedYearSummary.timeBuckets.evening >= selectedYearSummary.timeBuckets.morning
        ? 'Оройн цагуудад сул зай байна'
        : busiestRoom && quietestRoom && busiestRoom.roomId !== quietestRoom.roomId
          ? `Хамгийн сул ${quietestRoom.roomNumber} ангид эхэлж хуваарь нэмэх нь зөв`
          : 'Шинэ хичээл нэмэхэд тохиромжтой'

  return (
    <div className="min-w-0">
      <div className="border-b border-[#e1dfdd] px-4 py-3 dark:border-border">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">{calendarMonth.getFullYear()} оны төлөвлөгөө</p>
            <p className="text-xs text-muted-foreground">{selectedRoomView ? `${selectedRoomView.number} ангийн жилийн тойм` : 'Бүх ангийн жилийн тойм'}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {filterOptions.map((option) => (
              <button
                key={option.key}
                type="button"
                className={cn(
                  'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition',
                  yearFilter === option.key
                    ? 'border-[#6264a7] bg-[#eef0ff] text-[#323769] dark:border-[#8f93ff] dark:bg-[#252b45] dark:text-white'
                    : 'border-[#d9dbea] bg-white text-muted-foreground hover:border-[#bec2e5] hover:text-foreground dark:border-[#30364d] dark:bg-[#171b27] dark:hover:text-white',
                )}
                onClick={() => onFilterChange(option.key)}
              >
                <span>{option.label}</span>
                <span className="rounded-full bg-black/5 px-1.5 py-0.5 text-[10px] dark:bg-white/10">{yearFilterTotals[option.key]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 p-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {yearSummaries.map((summary) => (
            <button
              key={summary.monthStart.toISOString()}
              type="button"
              className={cn(
                'rounded-3xl border border-[#e7e9f6] bg-[linear-gradient(180deg,#ffffff_0%,#fbfbfe_100%)] p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-[#2c3149] dark:bg-[linear-gradient(180deg,#171b27_0%,#121724_100%)]',
                summary.monthStart.getFullYear() === calendarMonth.getFullYear() && summary.monthStart.getMonth() === calendarMonth.getMonth() && 'ring-2 ring-inset ring-[#6264a7]',
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
          ))}
        </div>

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
              const width = (value / total) * 100

              return (
                <div key={label} className="mb-2">
                  <div className="mb-1 flex items-center justify-between text-[11px]">
                    <span>{label}</span>
                    <span>{value}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#ebeefe] dark:bg-[#232b45]">
                    <div className="h-1.5 rounded-full bg-[#6264a7]" style={{ width: `${width}%` }} />
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
      </div>
    </div>
  )
}
