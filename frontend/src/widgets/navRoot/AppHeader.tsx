import { FC } from 'react';
import { useLocation } from 'react-router';
import type { IRoute } from '@/src/shared/types/route';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { findRouteLabel } from './findRouteLabel';

interface AppHeaderProps {
  menuRoutes: IRoute[];
}

export const AppHeader: FC<AppHeaderProps> = ({ menuRoutes }) => {
  const { pathname } = useLocation();
  const title = findRouteLabel(pathname, menuRoutes);

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b bg-background px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      {title && <span className="text-sm font-semibold">{title}</span>}
    </header>
  );
};
