import React from 'react';
import { TableCell } from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface TableCellCommonProps extends React.ComponentProps<typeof TableCell> {
  empty?: boolean;
  forceNotEmpty?: boolean;
  className?: string;
  children?: React.ReactNode;
  emptyText?: string;
}

export const TableCellCommon: React.FC<TableCellCommonProps> = ({
  empty = false,
  forceNotEmpty = false,
  className,
  children,
  emptyText = '—',
  ...props
}) => {
  const isEmpty = !forceNotEmpty && (empty || children === null || children === undefined || children === '');
  return (
    <TableCell className={cn(isEmpty && 'text-gray-400 italic', className)} {...props}>
      {isEmpty ? emptyText : children}
    </TableCell>
  );
};
