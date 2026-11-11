import React from 'react';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useGetTimeEntriesQuery } from '@/src/shared/api/rtkApi/cacheTags';
import { getErrorMessage } from '@/src/shared/api/rtkApi/getErrorMessage';
import { formatDuration } from '@/src/shared/lib/time/formatDuration';

interface EmployeeEntriesProps {
  employeeId: number;
  from: string;
  to: string;
}

const formatTime = (iso: string) => format(new Date(iso), 'dd.MM HH:mm');

export const EmployeeEntries: React.FC<EmployeeEntriesProps> = ({ employeeId, from, to }) => {
  const { data: entries, isLoading, error } = useGetTimeEntriesQuery({ employeeId, from, to });

  if (isLoading) return <Skeleton className="h-8 w-full" />;
  if (error) return <p className="text-sm text-destructive">{getErrorMessage(error)}</p>;
  if (!entries?.length) return <p className="text-sm text-muted-foreground">Записей нет</p>;

  return (
    <ul className="flex flex-col gap-1 text-sm">
      {entries.map((entry) => (
        <li key={entry.id} className="grid grid-cols-[1fr_auto_auto] items-center gap-4">
          <span className="truncate" title={entry.description}>
            {entry.description}
          </span>
          <span className="text-muted-foreground tabular-nums">
            {formatTime(entry.startedAt)} — {entry.endedAt ? formatTime(entry.endedAt) : <Badge>идёт</Badge>}
          </span>
          <span className="w-24 text-right tabular-nums">{formatDuration(entry.durationSeconds)}</span>
        </li>
      ))}
    </ul>
  );
};
