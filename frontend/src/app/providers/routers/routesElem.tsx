import { ChartNoAxesColumn, Users } from 'lucide-react';
import type { IRoute } from '@/src/shared/types/route';
import { EmployeesPage } from '@/src/pages/employees';
import { ReportPage } from '@/src/pages/report';

export const menuRoutes: IRoute[] = [
  {
    path: '/employees',
    label: 'Сотрудники',
    icon: Users,
    element: <EmployeesPage />,
  },
  {
    path: '/report',
    label: 'Отчёт',
    icon: ChartNoAxesColumn,
    element: <ReportPage />,
  },
];
