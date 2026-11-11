import type { IRoute } from '@/src/shared/types/route';

export const findRouteLabel = (pathname: string, routes: IRoute[]): string | undefined =>
  routes.find((route) => pathname === route.path || pathname.startsWith(`${route.path}/`))?.label;
