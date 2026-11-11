import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

export interface IRoute {
  path: string;
  label: string;
  icon: LucideIcon;
  element: ReactNode;
}
