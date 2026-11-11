import { describe, expect, it } from 'vitest';
import { Users } from 'lucide-react';
import type { IRoute } from '@/src/shared/types/route';
import { findRouteLabel } from './findRouteLabel';

const routes: IRoute[] = [
  { path: '/employees', label: 'Сотрудники', icon: Users, element: null },
  { path: '/report', label: 'Отчёт', icon: Users, element: null },
];

describe('findRouteLabel', () => {
  it('находит название по точному пути', () => {
    expect(findRouteLabel('/report', routes)).toBe('Отчёт');
  });

  it('находит название для вложенного пути', () => {
    expect(findRouteLabel('/employees/42', routes)).toBe('Сотрудники');
  });

  it('не путает пути с общим префиксом', () => {
    expect(findRouteLabel('/reports', routes)).toBeUndefined();
  });
});
