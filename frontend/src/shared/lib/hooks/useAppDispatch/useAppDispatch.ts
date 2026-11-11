import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/src/app/providers/storeProvider/store';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
