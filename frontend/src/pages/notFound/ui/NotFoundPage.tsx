import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <Card className="w-full max-w-md p-6">
        <div className="space-y-6 text-center">
          <h2 className="text-3xl font-bold">404</h2>
          <p className="text-muted-foreground">Страница не найдена</p>
          <Button asChild>
            <Link to="/">Вернуться на главную</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default NotFoundPage;
