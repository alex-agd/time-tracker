import { useMemo, useState } from 'react';
import { CalendarX2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetReportSummaryQuery } from '@/src/shared/api/rtkApi/cacheTags';
import { getErrorMessage } from '@/src/shared/api/rtkApi/getErrorMessage';
import { type DayPeriod, presetPeriod, toApiRange } from '@/src/shared/lib/period/period';
import { EmptyState } from '@/src/shared/ui/EmptyState/EmptyState';
import { PageHeader } from '@/src/shared/ui/PageHeader/PageHeader';
import { PeriodPicker } from '@/src/features/periodPicker/ui/PeriodPicker';
import { ReportView } from './ReportView';

const ReportPage = () => {
  const [period, setPeriod] = useState<DayPeriod>(() => presetPeriod('week'));
  const range = useMemo(() => toApiRange(period), [period]);
  const { data: report, isFetching, isLoading, error } = useGetReportSummaryQuery(range);

  const renderContent = () => {
    if (isLoading) return <Skeleton className="h-32 w-full" />;
    if (error || !report) {
      return <EmptyState icon={CalendarX2} title="Не удалось построить отчёт" description={getErrorMessage(error)} />;
    }
    return <ReportView report={report} />;
  };

  return (
    <div className="flex flex-col gap-4 p-6">
      <PageHeader
        title="Отчёт"
        description="Записи и общее время каждого сотрудника за период"
        actions={<PeriodPicker value={period} onChange={setPeriod} />}
      />
      <Card className={isFetching && !isLoading ? 'opacity-70 transition-opacity' : undefined}>
        <CardContent className="p-4">{renderContent()}</CardContent>
      </Card>
    </div>
  );
};

export default ReportPage;
