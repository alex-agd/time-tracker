import React, { FC } from 'react';
import type { IRoute } from '@/src/shared/types/route';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';

interface LayoutProps {
  menuRoutes: IRoute[];
  children?: React.ReactNode;
}

export const Layout: FC<LayoutProps> = ({ menuRoutes, children }) => {
  return (
    <SidebarProvider>
      <AppSidebar menuRoutes={menuRoutes} />
      <SidebarInset>
        <AppHeader menuRoutes={menuRoutes} />
        <main className="flex flex-1 flex-col">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
};
