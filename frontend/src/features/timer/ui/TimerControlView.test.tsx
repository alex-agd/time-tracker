import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, userEvent } from '@/src/test/test-utils';
import { TimerControlView } from './TimerControlView';

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('TimerControlView', () => {
  it('не даёт запустить таймер без описания', async () => {
    const onStart = vi.fn();
    render(<TimerControlView employeeName="Иван" onStart={onStart} onStop={vi.fn()} />);

    const startButton = screen.getByRole('button', { name: 'Запустить таймер: Иван' });
    expect(startButton).toBeDisabled();

    await userEvent.type(screen.getByLabelText('Описание задачи: Иван'), '   ');
    expect(startButton).toBeDisabled();
    expect(onStart).not.toHaveBeenCalled();
  });

  it('передаёт обрезанное описание и очищает поле после успешного старта', async () => {
    const onStart = vi.fn().mockResolvedValue(true);
    render(<TimerControlView employeeName="Иван" onStart={onStart} onStop={vi.fn()} />);

    const input = screen.getByLabelText('Описание задачи: Иван');
    await userEvent.type(input, '  Ревью кода  {Enter}');

    expect(onStart).toHaveBeenCalledWith('Ревью кода');
    expect(input).toHaveValue('');
  });

  it('сохраняет описание, если старт отклонён (например, таймер уже запущен)', async () => {
    const onStart = vi.fn().mockResolvedValue(false);
    render(<TimerControlView employeeName="Иван" onStart={onStart} onStop={vi.fn()} />);

    const input = screen.getByLabelText('Описание задачи: Иван');
    await userEvent.type(input, 'Задача{Enter}');

    expect(input).toHaveValue('Задача');
  });

  it('для запущенного таймера показывает описание, прошедшее время и кнопку стоп', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true, now: new Date('2026-11-11T10:01:05Z') });
    const onStop = vi.fn();
    render(
      <TimerControlView
        employeeName="Иван"
        activeTimer={{ description: 'Ревью кода', startedAt: '2026-11-11T10:00:00Z' }}
        onStart={vi.fn()}
        onStop={onStop}
      />
    );

    expect(screen.getByText('Ревью кода')).toBeInTheDocument();
    expect(screen.getByLabelText('Прошло времени')).toHaveTextContent('00:01:05');

    await userEvent.click(screen.getByRole('button', { name: 'Остановить таймер: Иван' }));
    expect(onStop).toHaveBeenCalledOnce();
  });
});
