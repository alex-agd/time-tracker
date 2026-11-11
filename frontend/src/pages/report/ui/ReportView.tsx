import React from 'react';
import { CalendarX2 } from 'lucide-react';
import type { ReportResponse } from '@/src/shared/api/rtkApi/cacheTags';
import { EmptyState } from '@/src/shared/ui/EmptyState/EmptyState';
import { ReportTable } from '@/src/widgets/reportTable/ui/ReportTable';

interface ReportViewProps {
  report: ReportResponse;
}

export const ReportView: React.FC<ReportViewProps> = ({ report }) => {
  const hasEntries = report.employees.some((row) => row.entriesCount > 0);
  if (!hasEntries) {
    return (
      <EmptyState
        icon={CalendarX2}
        title="Нет записей за выбранный период"
        description={
          report.employees.length === 0
            ? 'Сначала добавьте сотрудников на странице «Сотрудники».'
            : 'Выберите другой период или запустите таймер.'
        }
      />
    );
  }
  return <ReportTable rows={report.employees} totalSeconds={report.totalSeconds} from={report.from} to={report.to} />;
};
