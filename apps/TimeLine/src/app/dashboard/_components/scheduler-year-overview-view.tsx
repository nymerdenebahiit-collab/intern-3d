'use client'

import { formatMonthLabel } from '@/app/dashboard/_lib/scheduler-date-utils'
import type { MonthViewFilter, YearMonthSummary } from '@/app/dashboard/_lib/scheduler-types'
import { SchedulerYearInsightsPanel } from '@/app/dashboard/_components/scheduler-year-insights-panel'
import { SchedulerYearMonthCard } from '@/app/dashboard/_components/scheduler-year-month-card'
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
  const monthName = selectedYearSummary ? formatMonthLabel(selectedYearSummary.monthStart) : 'Сар сонгоно уу'
  const suggestion = !selectedYearSummary || selectedYearSummary.totalCount === 0
    ? 'Одоогоор дата алга'
    : selectedYearSummary.conflictCount > 0
      ? 'Шинэ давтамжтай хуваарь нэмэхээс өмнө давхцлыг шалгаарай'
      : selectedYearSummary.timeBuckets.evening >= selectedYearSummary.timeBuckets.morning
        ? 'Оройн цагуудад сул зай байна'
        : selectedYearSummary.roomLoads[0] && selectedYearSummary.roomLoads.at(-1) && selectedYearSummary.roomLoads[0].roomId !== selectedYearSummary.roomLoads.at(-1)?.roomId
          ? `Хамгийн сул ${selectedYearSummary.roomLoads.at(-1)?.roomNumber ?? ''} ангид эхэлж хуваарь нэмэх нь зөв`
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
            <SchedulerYearMonthCard
              key={summary.monthStart.toISOString()}
              isSelected={summary.monthStart.getFullYear() === calendarMonth.getFullYear() && summary.monthStart.getMonth() === calendarMonth.getMonth()}
              onSelectMonth={onSelectMonth}
              selectedRoomView={selectedRoomView}
              summary={summary}
            />
          ))}
        </div>

        <SchedulerYearInsightsPanel monthName={monthName} selectedYearSummary={selectedYearSummary} suggestion={suggestion} />
      </div>
    </div>
  )
}
