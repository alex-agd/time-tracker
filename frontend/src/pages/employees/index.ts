import { lazy } from 'react';

const EmployeesPageAsync = lazy(() => import('./ui/EmployeesPage'));
export { EmployeesPageAsync as EmployeesPage };
