import { Suspense } from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router';
import type { IRoute } from '@/src/shared/types/route';
import { ErrorBoundary } from '@/src/shared/ui/ErrorBoundary';
import { Layout } from '@/src/widgets/navRoot';
import { NotFoundPage } from '@/src/pages/notFound';

export const getRoutes = (menuRoutes: IRoute[]) =>
  createBrowserRouter([
    {
      path: '/',
      element: (
        <Layout menuRoutes={menuRoutes}>
          <ErrorBoundary showDetails={process.env.NODE_ENV === 'development'}>
            <Suspense>
              <Outlet />
            </Suspense>
          </ErrorBoundary>
        </Layout>
      ),
      children: [
        { index: true, element: <Navigate to="/employees" replace /> },
        ...menuRoutes.map(({ path, element }) => ({ path, element })),
      ],
    },
    {
      path: '*',
      element: (
        <Suspense>
          <NotFoundPage />
        </Suspense>
      ),
    },
  ]);
