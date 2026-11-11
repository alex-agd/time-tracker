import React, { Fragment, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableCellCommon } from '@/src/shared/ui/table/TableCellCommon';
import type { EmployeeTotal } from '@/src/shared/api/rtkApi/cacheTags';
import { formatDuration } from '@/src/shared/lib/time/formatDuration';
import { cn } from '@/lib/utils';
import { EmployeeEntries } from './EmployeeEntries';

interface ReportTableProps {
  rows: EmployeeTotal[];
  totalSeconds: number;
  from: string;
  to: string;
}

export const ReportTable: React.FC<ReportTableProps> = ({ rows, totalSeconds, from, to }) => {
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const toggle = (employeeId: number) =>
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(employeeId)) next.delete(employeeId);
      else next.add(employeeId);
      return next;
    });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10" />
          <TableHead className="text-xs font-bold">Сотрудник</TableHead>
          <TableHead className="text-xs font-bold">Должность</TableHead>
          <TableHead className="text-right text-xs font-bold">Записей</TableHead>
          <TableHead className="text-right text-xs font-bold">Время</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => {
          const isOpen = expanded.has(row.employeeId);
          const hasEntries = row.entriesCount > 0;
          return (
            <Fragment key={row.employeeId}>
              <TableRow className={cn(!hasEntries && 'text-muted-foreground')}>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    disabled={!hasEntries}
                    onClick={() => toggle(row.employeeId)}
                    aria-expanded={isOpen}
                    aria-label={`Записи сотрудника ${row.fullName}`}
                  >
                    <ChevronRight className={cn('transition-transform', isOpen && 'rotate-90')} />
                  </Button>
                </TableCell>
                <TableCellCommon className="font-medium">{row.fullName}</TableCellCommon>
                <TableCellCommon>{row.position}</TableCellCommon>
                <TableCellCommon className="text-right tabular-nums">{row.entriesCount}</TableCellCommon>
                <TableCellCommon className="text-right tabular-nums">
                  {formatDuration(row.totalSeconds)}
                </TableCellCommon>
              </TableRow>
              {isOpen && (
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableCell />
                  <TableCell colSpan={4}>
                    <EmployeeEntries employeeId={row.employeeId} from={from} to={to} />
                  </TableCell>
                </TableRow>
              )}
            </Fragment>
          );
        })}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={4} className="font-semibold">
            Итого
          </TableCell>
          <TableCell className="text-right font-semibold tabular-nums">{formatDuration(totalSeconds)}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};
