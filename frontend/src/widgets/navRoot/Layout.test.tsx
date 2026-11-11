import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router';
import { ChartNoAxesColumn, Users } from 'lucide-react';
import { cleanup, render, screen } from '@/src/test/test-utils';
import type { IRoute } from '@/src/shared/types/route';
import { Layout } from './Layout';

const routes: IRoute[] = [
  { path: '/employees', label: 'Сотрудники', icon: Users, element: null },
  { path: '/report', label: 'Отчёт', icon: ChartNoAxesColumn, element: null },
];

const renderLayout = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Layout menuRoutes={routes}>
        <div>контент</div>
      </Layout>
    </MemoryRouter>
  );

beforeAll(() => {
  window.matchMedia = vi.fn().mockReturnValue({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  });
});

afterEach(() => {
  cleanup();
});

describe('Layout', () => {
  it('показывает пункты меню и контент', () => {
    renderLayout('/employees');

    expect(screen.getByText('Учёт времени')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Сотрудники' })).toHaveAttribute('href', '/employees');
    expect(screen.getByRole('link', { name: 'Отчёт' })).toHaveAttribute('href', '/report');
    expect(screen.getByText('контент')).toBeInTheDocument();
  });

  it('выводит в шапке название текущей страницы', () => {
    renderLayout('/report');

    expect(screen.getByRole('banner')).toHaveTextContent('Отчёт');
  });
});
