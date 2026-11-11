import './global.css';
import { RouterProvider } from 'react-router';
import { Toaster } from '@/components/ui/sonner';
import { getRoutes } from '@/src/app/providers/routers/Routes';
import { menuRoutes } from '@/src/app/providers/routers/routesElem';

const router = getRoutes(menuRoutes);

function App() {
  return (
    <>
      <Toaster position="top-center" duration={5000} closeButton richColors />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
