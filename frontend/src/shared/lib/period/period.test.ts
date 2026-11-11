import { describe, expect, it } from 'vitest';
import { presetPeriod, toApiRange } from './period';

describe('presetPeriod', () => {
  const wednesday = new Date(2026, 10, 11, 15, 30);

  it('сегодня — один день', () => {
    const period = presetPeriod('today', wednesday);
    expect(period.from).toEqual(new Date(2026, 10, 11));
    expect(period.to).toEqual(new Date(2026, 10, 11));
  });

  it('неделя начинается с понедельника', () => {
    const period = presetPeriod('week', wednesday);
    expect(period.from).toEqual(new Date(2026, 10, 9));
    expect(period.to).toEqual(new Date(2026, 10, 15));
  });

  it('месяц — с первого по последнее число', () => {
    const period = presetPeriod('month', wednesday);
    expect(period.from).toEqual(new Date(2026, 10, 1));
    expect(period.to).toEqual(new Date(2026, 10, 30));
  });
});

describe('toApiRange', () => {
  it('включает последний день целиком', () => {
    const range = toApiRange({ from: new Date(2026, 10, 11), to: new Date(2026, 10, 11) });
    expect(range.from).toBe(new Date(2026, 10, 11).toISOString());
    expect(range.to).toBe(new Date(2026, 10, 12).toISOString());
  });
});
