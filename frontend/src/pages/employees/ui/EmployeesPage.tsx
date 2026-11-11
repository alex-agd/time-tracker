import { Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useGetEmployeesQuery } from '@/src/shared/api/rtkApi/cacheTags';
import { getErrorMessage } from '@/src/shared/api/rtkApi/getErrorMessage';
import { EmptyState } from '@/src/shared/ui/EmptyState/EmptyState';
import { PageHeader } from '@/src/shared/ui/PageHeader/PageHeader';
import { CreateEmployeeDialog } from '@/src/features/createEmployee/ui/CreateEmployeeDialog';
import { EmployeesTable } from '@/src/widgets/employeesTable/ui/EmployeesTable';

const EmployeesPage = () => {
  const { data: employees, isLoading, error, refetch } = useGetEmployeesQuery();

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col gap-2" aria-label="Загрузка">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-10 w-full" />
          ))}
        </div>
      );
    }
    if (error) {
      return (
        <EmptyState
          icon={Users}
          title="Не удалось загрузить сотрудников"
          description={getErrorMessage(error)}
          action={
            <Button variant="outline" onClick={() => refetch()}>
              Повторить
            </Button>
          }
        />
      );
    }
    if (!employees?.length) {
      return (
        <EmptyState
          icon={Users}
          title="Сотрудников пока нет"
          description="Добавьте первого сотрудника, чтобы запускать таймеры."
          action={<CreateEmployeeDialog />}
        />
      );
    }
    return <EmployeesTable employees={employees} />;
  };

  return (
    <div className="flex flex-col gap-4 p-6">
      <PageHeader
        title="Сотрудники"
        description="Запускайте и останавливайте таймер с описанием задачи"
        actions={employees?.length ? <CreateEmployeeDialog /> : null}
      />
      <Card>
        <CardContent className="p-4">{renderContent()}</CardContent>
      </Card>
    </div>
  );
};

export default EmployeesPage;
