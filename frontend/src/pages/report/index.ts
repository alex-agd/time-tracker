import { lazy } from 'react';

const ReportPageAsync = lazy(() => import('./ui/ReportPage'));
export { ReportPageAsync as ReportPage };
