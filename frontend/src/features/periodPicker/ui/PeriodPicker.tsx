import React, { useState } from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import type { DateRange } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { type DayPeriod, PERIOD_PRESETS, presetPeriod } from '@/src/shared/lib/period/period';

interface PeriodPickerProps {
  value: DayPeriod;
  onChange: (period: DayPeriod) => void;
}

const formatDay = (date: Date) => format(date, 'd MMM yyyy', { locale: ru });

export const formatPeriod = (period: DayPeriod) =>
  period.from.getTime() === period.to.getTime()
    ? formatDay(period.from)
    : `${formatDay(period.from)} — ${formatDay(period.to)}`;

export const PeriodPicker: React.FC<PeriodPickerProps> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<DateRange | undefined>({ from: value.from, to: value.to });

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) setDraft({ from: value.from, to: value.to });
  };

  const applyDraft = () => {
    if (!draft?.from) return;
    onChange({ from: draft.from, to: draft.to ?? draft.from });
    setOpen(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {PERIOD_PRESETS.map((preset) => (
        <Button key={preset.id} variant="outline" size="sm" onClick={() => onChange(presetPeriod(preset.id))}>
          {preset.label}
        </Button>
      ))}
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" aria-label="Выбрать период">
            <CalendarIcon />
            {formatPeriod(value)}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar mode="range" numberOfMonths={2} selected={draft} onSelect={setDraft} defaultMonth={value.from} />
          <div className="flex justify-end gap-2 border-t p-3">
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
              Отмена
            </Button>
            <Button size="sm" disabled={!draft?.from} onClick={applyDraft}>
              Применить
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
