import { addDays, endOfMonth, endOfWeek, startOfDay, startOfMonth, startOfWeek } from 'date-fns';

/** Период включительно по календарным дням в локальной таймзоне пользователя */
export interface DayPeriod {
  from: Date;
  to: Date;
}

export type PeriodPreset = 'today' | 'week' | 'month';

export const PERIOD_PRESETS: { id: PeriodPreset; label: string }[] = [
  { id: 'today', label: 'Сегодня' },
  { id: 'week', label: 'Неделя' },
  { id: 'month', label: 'Месяц' },
];

export const presetPeriod = (preset: PeriodPreset, now: Date = new Date()): DayPeriod => {
  switch (preset) {
    case 'today':
      return { from: startOfDay(now), to: startOfDay(now) };
    case 'week':
      return { from: startOfWeek(now, { weekStartsOn: 1 }), to: startOfDay(endOfWeek(now, { weekStartsOn: 1 })) };
    case 'month':
      return { from: startOfMonth(now), to: startOfDay(endOfMonth(now)) };
  }
};

/** Перевод в полуинтервал [from, to) для API: конец — начало следующего дня после последнего выбранного */
export const toApiRange = (period: DayPeriod): { from: string; to: string } => ({
  from: startOfDay(period.from).toISOString(),
  to: addDays(startOfDay(period.to), 1).toISOString(),
});
