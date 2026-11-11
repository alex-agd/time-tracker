import { lazy } from 'react';

const NotFoundPageAsync = lazy(() => import('./ui/NotFoundPage'));
export { NotFoundPageAsync as NotFoundPage };
