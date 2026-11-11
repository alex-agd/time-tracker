import { z } from 'zod';

export const createEmployeeSchema = z.object({
  fullName: z.string().trim().min(1, 'Укажите ФИО').max(200, 'Не длиннее 200 символов'),
  position: z.string().trim().max(200, 'Не длиннее 200 символов'),
});

export type CreateEmployeeForm = z.infer<typeof createEmployeeSchema>;
