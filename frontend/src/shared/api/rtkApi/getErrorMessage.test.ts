import { describe, expect, it } from 'vitest';
import { getErrorMessage } from './getErrorMessage';

describe('getErrorMessage', () => {
  it('берёт detail из ProblemDetail', () => {
    expect(getErrorMessage({ status: 409, data: { title: 'Конфликт', detail: 'Таймер уже запущен' } })).toBe(
      'Таймер уже запущен'
    );
  });

  it('сообщает о недоступном сервере', () => {
    expect(getErrorMessage({ status: 'FETCH_ERROR', error: 'TypeError' })).toBe('Сервер недоступен');
  });

  it('возвращает fallback для неизвестного ответа', () => {
    expect(getErrorMessage({ status: 500, data: '<html>' }, 'Ошибка')).toBe('Ошибка');
  });
});
