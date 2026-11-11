import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { SerializedError } from '@reduxjs/toolkit';

interface ProblemDetail {
  title?: string;
  detail?: string;
}

const isProblemDetail = (data: unknown): data is ProblemDetail =>
  typeof data === 'object' && data !== null && ('detail' in data || 'title' in data);

/** Достаёт человекочитаемое сообщение из ProblemDetail бэкенда или сетевой ошибки */
export const getErrorMessage = (
  error: FetchBaseQueryError | SerializedError | undefined,
  fallback = 'Что-то пошло не так'
): string => {
  if (!error) return fallback;
  if ('status' in error) {
    if (error.status === 'FETCH_ERROR') return 'Сервер недоступен';
    if (isProblemDetail(error.data)) return error.data.detail ?? error.data.title ?? fallback;
    return fallback;
  }
  return error.message ?? fallback;
};
