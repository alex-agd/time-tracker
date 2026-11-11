import { describe, expect, it } from 'vitest';
import { formatClock, formatDuration } from './formatDuration';

describe('formatClock', () => {
  it('форматирует часы, минуты и секунды с ведущими нулями', () => {
    expect(formatClock(3725)).toBe('01:02:05');
  });

  it('не уходит в минус при рассинхроне часов клиента и сервера', () => {
    expect(formatClock(-15)).toBe('00:00:00');
  });

  it('не обрезает часы больше суток', () => {
    expect(formatClock(100 * 3600)).toBe('100:00:00');
  });
});

describe('formatDuration', () => {
  it('показывает только минуты, если меньше часа', () => {
    expect(formatDuration(59 * 60 + 59)).toBe('59 мин');
  });

  it('показывает часы и минуты', () => {
    expect(formatDuration(3725)).toBe('1 ч 02 мин');
  });

  it('пустой отчёт — ноль минут', () => {
    expect(formatDuration(0)).toBe('0 мин');
  });
});
