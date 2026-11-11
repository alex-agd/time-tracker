import React, { useState } from 'react';
import { Play, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatClock } from '@/src/shared/lib/time/formatDuration';
import { useNow } from '@/src/shared/lib/time/useNow';

export interface ActiveTimer {
  description: string;
  startedAt: string;
}

interface TimerControlViewProps {
  employeeName: string;
  activeTimer?: ActiveTimer | null;
  pending?: boolean;
  onStart: (description: string) => Promise<boolean>;
  onStop: () => void;
}

const MAX_DESCRIPTION = 500;

export const TimerControlView: React.FC<TimerControlViewProps> = ({
  employeeName,
  activeTimer,
  pending = false,
  onStart,
  onStop,
}) => {
  const [description, setDescription] = useState('');
  const now = useNow(Boolean(activeTimer));
  const trimmed = description.trim();

  if (activeTimer) {
    const elapsedSeconds = (now - new Date(activeTimer.startedAt).getTime()) / 1000;
    return (
      <div className="flex items-center gap-3">
        <span className="min-w-0 flex-1 truncate text-sm" title={activeTimer.description}>
          {activeTimer.description}
        </span>
        <span className="font-mono text-sm tabular-nums" aria-label="Прошло времени">
          {formatClock(elapsedSeconds)}
        </span>
        <Button
          size="sm"
          variant="destructive"
          disabled={pending}
          onClick={onStop}
          aria-label={`Остановить таймер: ${employeeName}`}
        >
          <Square />
          Стоп
        </Button>
      </div>
    );
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!trimmed) return;
    if (await onStart(trimmed)) {
      setDescription('');
    }
  };

  return (
    <form className="flex items-center gap-3" onSubmit={handleSubmit}>
      <Input
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Над чем работаете?"
        maxLength={MAX_DESCRIPTION}
        aria-label={`Описание задачи: ${employeeName}`}
        className="h-8"
      />
      <Button type="submit" size="sm" disabled={pending || !trimmed} aria-label={`Запустить таймер: ${employeeName}`}>
        <Play />
        Старт
      </Button>
    </form>
  );
};
