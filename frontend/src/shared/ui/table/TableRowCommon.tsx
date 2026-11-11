import React from 'react';
import { TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface TableRowCommonProps extends React.ComponentProps<typeof TableRow> {
  selected?: boolean;
  hover?: boolean;
  empty?: boolean;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}

export const TableRowCommon: React.FC<TableRowCommonProps> = ({
  selected = false,
  hover = true,
  empty = false,
  onClick,
  className,
  children,
  ...props
}) => (
  <TableRow
    className={cn(
      'text-xs',
      hover && 'cursor-pointer hover:bg-muted/50',
      selected && 'bg-primary/10',
      empty && 'text-gray-400 italic',
      className
    )}
    onClick={onClick}
    {...props}
  >
    {children}
  </TableRow>
);
