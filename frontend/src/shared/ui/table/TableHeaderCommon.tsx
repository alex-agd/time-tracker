import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { flexRender } from '@tanstack/react-table';

interface TableHeaderCommonProps {
  headers: any[];
  className?: string;
  wrapHeaders?: boolean;
  children?: React.ReactNode;
}

export const TableHeaderCommon: React.FC<TableHeaderCommonProps> = ({ headers, className, wrapHeaders = false }) => {
  'use no memo';

  return (
    <TableHeader className={className}>
      <TableRow>
        {headers.map((header) => {
          const headerContent = header.column?.columnDef.header;
          const canSort = header.column?.getCanSort();
          const canResize = header.column?.getCanResize() && header.getResizeHandler;
          const sortDirection = header.column?.getIsSorted();

          return (
            <TableHead
              key={header.id}
              colSpan={header.colSpan}
              className="text-xs font-bold"
              style={{
                position: 'relative',
                width: header.getSize ? header.getSize() : undefined,
              }}
            >
              {header.isPlaceholder ? null : (
                <div
                  onClick={header.column?.getToggleSortingHandler()}
                  onKeyDown={(event) => {
                    if (canSort && (event.key === 'Enter' || event.key === ' ')) {
                      event.preventDefault();
                      header.column.toggleSorting(header.column.getIsSorted() === 'asc');
                    }
                  }}
                  role={canSort ? 'button' : undefined}
                  tabIndex={canSort ? 0 : undefined}
                  aria-sort={sortDirection ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined}
                  className={`flex min-w-0 items-center gap-1 ${canSort ? 'cursor-pointer select-none' : ''} ${
                    canResize ? 'pr-2' : ''
                  }`}
                >
                  {wrapHeaders && typeof headerContent === 'string' ? (
                    <span className="min-w-0 break-words whitespace-normal">{headerContent}</span>
                  ) : typeof headerContent === 'function' && header.getContext ? (
                    flexRender(headerContent, header.getContext())
                  ) : (
                    headerContent
                  )}
                  {{
                    asc: <ArrowUp className="h-4 w-4 shrink-0" />,
                    desc: <ArrowDown className="h-4 w-4 shrink-0" />,
                  }[sortDirection as string] ?? null}
                </div>
              )}
              {canResize && (
                <div
                  role="separator"
                  aria-orientation="vertical"
                  aria-label="Изменить ширину колонки"
                  onMouseDown={header.getResizeHandler()}
                  onTouchStart={header.getResizeHandler()}
                  onClick={(event) => event.stopPropagation()}
                  onDoubleClick={() => header.column.resetSize()}
                  className="group absolute top-0 right-0 z-10 flex h-full w-2 cursor-col-resize touch-none items-center justify-center select-none"
                >
                  <span
                    className={`h-[60%] w-[3px] rounded-full transition-colors duration-150 ${
                      header.column.getIsResizing()
                        ? 'bg-primary'
                        : 'bg-[rgba(0,0,0,0.15)] group-hover:bg-[rgba(0,0,0,0.35)]'
                    }`}
                  />
                </div>
              )}
            </TableHead>
          );
        })}
      </TableRow>
    </TableHeader>
  );
};
