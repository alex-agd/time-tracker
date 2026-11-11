import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { FormField } from '@/src/shared/ui/FormField/FormField';
import { useCreateEmployeeMutation } from '@/src/shared/api/rtkApi/cacheTags';
import { getErrorMessage } from '@/src/shared/api/rtkApi/getErrorMessage';
import { type CreateEmployeeForm, createEmployeeSchema } from '../model/schema';

const DEFAULT_VALUES: CreateEmployeeForm = { fullName: '', position: '' };

export const CreateEmployeeDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [createEmployee, { isLoading }] = useCreateEmployeeMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateEmployeeForm>({ resolver: zodResolver(createEmployeeSchema), defaultValues: DEFAULT_VALUES });

  const onSubmit = async (values: CreateEmployeeForm) => {
    try {
      const employee = await createEmployee({
        fullName: values.fullName,
        position: values.position || undefined,
      }).unwrap();
      toast.success(`Сотрудник «${employee.fullName}» добавлен`);
      reset(DEFAULT_VALUES);
      setOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error as Parameters<typeof getErrorMessage>[0], 'Не удалось добавить сотрудника'));
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset(DEFAULT_VALUES);
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <UserPlus />
          Добавить сотрудника
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Новый сотрудник</DialogTitle>
            <DialogDescription>Используйте вымышленные данные.</DialogDescription>
          </DialogHeader>
          <FormField
            id="fullName"
            label="ФИО"
            placeholder="Иван Петров"
            autoFocus
            error={errors.fullName?.message}
            {...register('fullName')}
          />
          <FormField
            id="position"
            label="Должность"
            placeholder="Необязательно"
            error={errors.position?.message}
            {...register('position')}
          />
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              Сохранить
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
