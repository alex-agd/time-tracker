import { useSelector } from 'react-redux';
import type { RootState } from '@/src/app/providers/storeProvider/store';

export const useAppSelector = useSelector.withTypes<RootState>();
