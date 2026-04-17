import type { RoomStatus, EventType } from './types'

// Room status config - using unified Mongolian labels
// "Нээлттэй" represents open/available including open lab periods
export const STATUS_CONFIG: Record<RoomStatus, { label: string; color: string; bgColor: string; dotColor: string }> = {
  available: {
    label: 'Нээлттэй',
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-100 dark:bg-emerald-500/20 border-emerald-200 dark:border-emerald-500/30',
    dotColor: 'bg-emerald-500',
  },
  class: {
    label: 'Хичээлтэй',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-500/20 border-blue-200 dark:border-blue-500/30',
    dotColor: 'bg-blue-500',
  },
  club: {
    label: 'Клубтэй',
    color: 'text-violet-600 dark:text-violet-400',
    bgColor: 'bg-violet-100 dark:bg-violet-500/20 border-violet-200 dark:border-violet-500/30',
    dotColor: 'bg-violet-500',
  },
  closed: {
    label: 'Хаалттай',
    color: 'text-rose-600 dark:text-rose-400',
    bgColor: 'bg-rose-100 dark:bg-rose-500/20 border-rose-200 dark:border-rose-500/30',
    dotColor: 'bg-rose-500',
  },
}

// Event type colors for schedule display
export const EVENT_TYPE_CONFIG: Record<EventType, { label: string; bgColor: string; borderColor: string }> = {
  class: { 
    label: 'Хичээл', 
    bgColor: 'bg-blue-500/80 dark:bg-blue-600/80',
    borderColor: 'border-l-blue-600 dark:border-l-blue-400',
  },
  club: { 
    label: 'Клуб', 
    bgColor: 'bg-violet-500/80 dark:bg-violet-600/80',
    borderColor: 'border-l-violet-600 dark:border-l-violet-400',
  },
  openlab: { 
    label: 'Нээлттэй (Open Lab)', 
    bgColor: 'bg-emerald-500/80 dark:bg-emerald-600/80',
    borderColor: 'border-l-emerald-600 dark:border-l-emerald-400',
  },
  closed: { 
    label: 'Хаалттай', 
    bgColor: 'bg-rose-500/80 dark:bg-rose-600/80',
    borderColor: 'border-l-rose-600 dark:border-l-rose-400',
  },
}

export const DAYS_OF_WEEK = [
  { value: 1, label: 'Даваа', short: 'Дав' },
  { value: 2, label: 'Мягмар', short: 'Мяг' },
  { value: 3, label: 'Лхагва', short: 'Лха' },
  { value: 4, label: 'Пүрэв', short: 'Пүр' },
  { value: 5, label: 'Баасан', short: 'Баа' },
  { value: 6, label: 'Бямба', short: 'Бям' },
  { value: 0, label: 'Ням', short: 'Ням' },
]

export const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00',
]

export const PRIORITY_ORDER = ['class', 'club', 'openlab', 'closed'] as const
