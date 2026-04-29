export function getWeekStart(date: Date): Date {
  const copy = new Date(date)
  const day = copy.getDay() === 0 ? 7 : copy.getDay()
  copy.setDate(copy.getDate() - day + 1)
  copy.setHours(0, 0, 0, 0)
  return copy
}

export function toIsoDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function addDays(date: Date, days: number): Date {
  const copy = new Date(date)
  copy.setDate(copy.getDate() + days)
  return copy
}

export function addMonths(date: Date, months: number): Date {
  const copy = new Date(date)
  copy.setMonth(copy.getMonth() + months)
  return copy
}

export function addYears(date: Date, years: number): Date {
  const copy = new Date(date)
  copy.setFullYear(copy.getFullYear() + years)
  return copy
}

export function getMonthStart(date: Date): Date {
  const copy = new Date(date)
  copy.setDate(1)
  copy.setHours(0, 0, 0, 0)
  return copy
}

function getCalendarGridStart(date: Date): Date {
  const monthStart = getMonthStart(date)
  const day = monthStart.getDay() === 0 ? 7 : monthStart.getDay()
  return addDays(monthStart, -(day - 1))
}

export function getMonthDays(date: Date): Date[] {
  const start = getCalendarGridStart(date)
  return Array.from({ length: 42 }, (_, index) => addDays(start, index))
}

export function isSameDate(left: Date, right: Date): boolean {
  return left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth() && left.getDate() === right.getDate()
}

export function isSameMonth(left: Date, right: Date): boolean {
  return left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth()
}

export function isDateInSelectedWeek(date: Date, weekStart: Date): boolean {
  return date.getTime() >= weekStart.getTime() && date.getTime() < addDays(weekStart, 7).getTime()
}

export function formatShortDate(date: Date): string {
  return new Intl.DateTimeFormat('mn-MN', { month: '2-digit', day: '2-digit' }).format(date)
}

export function formatMonthLabel(date: Date): string {
  return new Intl.DateTimeFormat('mn-MN', { month: 'long', year: 'numeric' }).format(date)
}

export function formatWeekdayName(date: Date): string {
  return new Intl.DateTimeFormat('mn-MN', { weekday: 'long' }).format(date)
}

export function formatMonthDayLabel(date: Date): string {
  return new Intl.DateTimeFormat('mn-MN', { month: 'long', day: 'numeric' }).format(date)
}

export function isDateBefore(left: Date, right: Date) {
  return left.getTime() < right.getTime()
}

export function getDayOfWeekValue(date: Date): number {
  return date.getDay() === 0 ? 7 : date.getDay()
}

export function getYearStart(date: Date): Date {
  const copy = new Date(date)
  copy.setMonth(0, 1)
  copy.setHours(0, 0, 0, 0)
  return copy
}

export function getYearMonths(date: Date): Date[] {
  const yearStart = getYearStart(date)
  return Array.from({ length: 12 }, (_, index) => addMonths(yearStart, index))
}

export function getMonthDaysInMonth(date: Date): Date[] {
  const monthStart = getMonthStart(date)
  const nextMonth = addMonths(monthStart, 1)
  const totalDays = Math.round((nextMonth.getTime() - monthStart.getTime()) / (1000 * 60 * 60 * 24))
  return Array.from({ length: totalDays }, (_, index) => addDays(monthStart, index))
}

export function formatMonthShortLabel(date: Date): string {
  return new Intl.DateTimeFormat('mn-MN', { month: 'short' }).format(date)
}
