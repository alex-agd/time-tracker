import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, userEvent } from '@/src/test/test-utils';
import { ColumnDef, getCoreRowModel, OnChangeFn, SortingState, useReactTable } from '@tanstack/react-table';
import { Table } from '@/components/ui/table';
import { TableHeaderCommon } from '@/src/shared/ui/table/TableHeaderCommon';

interface Row {
  fio: string;
}

const columns: ColumnDef<Row>[] = [{ id: 'fio', accessorKey: 'fio', header: 'ФИО', size: 200, minSize: 120 }];

const Harness: React.FC<{ onSortingChange: OnChangeFn<SortingState> }> = ({ onSortingChange }) => {
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: [{ fio: 'Иванов Иван Иванович' }],
    columns,
    state: { sorting: [] },
    onSortingChange,
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    manualSorting: true,
    enableSortingRemoval: false,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table>
      <TableHeaderCommon headers={table.getFlatHeaders()} wrapHeaders />
    </Table>
  );
};

afterEach(() => {
  cleanup();
});

describe('TableHeaderCommon', () => {
  it('не сортирует при клике по ручке ресайза', async () => {
    const onSortingChange = vi.fn();
    render(<Harness onSortingChange={onSortingChange} />);

    await userEvent.click(screen.getByRole('separator', { name: 'Изменить ширину колонки' }));

    expect(onSortingChange).not.toHaveBeenCalled();
  });

  it('переключает сортировку ровно один раз за клик по заголовку', async () => {
    const onSortingChange = vi.fn();
    render(<Harness onSortingChange={onSortingChange} />);

    await userEvent.click(screen.getByText('ФИО'));

    expect(onSortingChange).toHaveBeenCalledTimes(1);
  });

  it('переносит строковый заголовок по словам, когда включён wrapHeaders', () => {
    render(<Harness onSortingChange={vi.fn()} />);
    const label = screen.getByText('ФИО');

    expect(label).toHaveClass('whitespace-normal');
    expect(label).toHaveClass('break-words');
    expect(label).not.toHaveClass('truncate');
  });

  it('рендерит заголовок-функцию через flexRender, а не как функцию', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    const FunctionHeaderHarness = () => {
      // eslint-disable-next-line react-hooks/incompatible-library
      const table = useReactTable({
        data: [{ fio: 'Иванов' }],
        columns: [
          { id: 'expander', header: ({ table }) => <button type="button">Раскрыть {table.getRowCount()}</button> },
        ],
        getCoreRowModel: getCoreRowModel(),
      });
      return (
        <Table>
          <TableHeaderCommon headers={table.getFlatHeaders()} wrapHeaders />
        </Table>
      );
    };

    render(<FunctionHeaderHarness />);

    expect(screen.getByRole('button', { name: 'Раскрыть 1' })).toBeInTheDocument();
    expect(consoleError).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });
});
