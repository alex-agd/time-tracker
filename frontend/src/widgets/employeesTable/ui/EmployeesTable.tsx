import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableCellCommon } from '@/src/shared/ui/table/TableCellCommon';
import type { EmployeeResponse } from '@/src/shared/api/rtkApi/cacheTags';
import { TimerControl } from '@/src/features/timer/ui/TimerControl';

interface EmployeesTableProps {
  employees: EmployeeResponse[];
}

export const EmployeesTable: React.FC<EmployeesTableProps> = ({ employees }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead className="w-[30%] text-xs font-bold">Сотрудник</TableHead>
        <TableHead className="w-[20%] text-xs font-bold">Должность</TableHead>
        <TableHead className="w-[10%] text-xs font-bold">Статус</TableHead>
        <TableHead className="text-xs font-bold">Таймер</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {employees.map((employee) => (
        <TableRow key={employee.id}>
          <TableCellCommon className="font-medium">{employee.fullName}</TableCellCommon>
          <TableCellCommon>{employee.position}</TableCellCommon>
          <TableCellCommon forceNotEmpty>
            {employee.activeEntry ? <Badge>В работе</Badge> : <Badge variant="secondary">Свободен</Badge>}
          </TableCellCommon>
          <TableCellCommon forceNotEmpty>
            <TimerControl employee={employee} />
          </TableCellCommon>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);
