import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Пути в OpenAPI-спецификации уже начинаются с /api
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '' }),
  endpoints: () => ({}),
});
