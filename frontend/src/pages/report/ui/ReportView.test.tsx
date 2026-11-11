import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@/src/test/test-utils';
import type { ReportResponse } from '@/src/shared/api/rtkApi/cacheTags';
import { ReportView } from './ReportView';

const PERIOD = { from: '2026-11-09T00:00:00Z', to: '2026-11-16T00:00:00Z' };

afterEach(cleanup);

describe('ReportView', () => {
  it('пустой отчёт без сотрудников подсказывает добавить сотрудников', () => {
    render(<ReportView report={{ ...PERIOD, totalSeconds: 0, employees: [] }} />);

    expect(screen.getByText('Нет записей за выбранный период')).toBeInTheDocument();
    expect(screen.getByText(/добавьте сотрудников/)).toBeInTheDocument();
  });

  it('пустой отчёт при сотрудниках без записей не показывает таблицу с нулями', () => {
    const report: ReportResponse = {
      ...PERIOD,
      totalSeconds: 0,
      employees: [{ employeeId: 1, fullName: 'Иван Петров', totalSeconds: 0, entriesCount: 0 }],
    };
    render(<ReportView report={report} />);

    expect(screen.getByText('Нет записей за выбранный период')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('показывает итоги по сотрудникам и общее время', () => {
    const report: ReportResponse = {
      ...PERIOD,
      totalSeconds: 3 * 3600 + 30 * 60,
      employees: [
        { employeeId: 1, fullName: 'Иван Петров', position: 'Backend', totalSeconds: 2 * 3600, entriesCount: 2 },
        { employeeId: 2, fullName: 'Мария Соколова', totalSeconds: 90 * 60, entriesCount: 1 },
      ],
    };
    render(<ReportView report={report} />);

    expect(screen.getByText('Иван Петров')).toBeInTheDocument();
    expect(screen.getByText('2 ч 00 мин')).toBeInTheDocument();
    expect(screen.getByText('1 ч 30 мин')).toBeInTheDocument();
    expect(screen.getByText('3 ч 30 мин')).toBeInTheDocument();
  });
});
