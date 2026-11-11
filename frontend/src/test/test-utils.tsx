import React, { useState } from 'react';
import { render as rtlRender, RenderOptions, RenderResult } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore, Store } from '@reduxjs/toolkit';
import type { RootState } from '@/src/app/providers/storeProvider/store';
import { appReducer } from '@/src/app/providers/storeProvider/store';
import { baseApi } from '@/src/shared/api/rtkApi/baseApi';

export function createTestStore(preloadedState?: Partial<RootState>): Store<RootState> {
  return configureStore({
    reducer: appReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
  });
}

type ReduxWrapperProps = {
  children: React.ReactNode;
  store?: Store<RootState>;
  preloadedState?: Partial<RootState>;
};

export function ReduxWrapper({ children, store: storeProp, preloadedState }: ReduxWrapperProps) {
  const [internalStore] = useState(() => createTestStore(preloadedState));
  const store = storeProp ?? internalStore;
  return <Provider store={store}>{children}</Provider>;
}

type RenderWithStoreOptions = Omit<RenderOptions, 'wrapper'> & {
  wrapper?: React.ComponentType<{ children: React.ReactNode }>;
  store?: Store<RootState>;
  preloadedState?: Partial<RootState>;
};

export function render(ui: React.ReactElement, options: RenderWithStoreOptions = {}): RenderResult {
  const { wrapper: CustomWrapper, store, preloadedState, ...rest } = options;
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <ReduxWrapper store={store} preloadedState={preloadedState}>
      {CustomWrapper ? <CustomWrapper>{children}</CustomWrapper> : children}
    </ReduxWrapper>
  );
  return rtlRender(ui, { wrapper: Wrapper, ...rest });
}

export {
  screen,
  waitFor,
  within,
  cleanup,
  act,
  fireEvent,
  waitForElementToBeRemoved,
  renderHook,
} from '@testing-library/react';

export { default as userEvent } from '@testing-library/user-event';

export type { RenderOptions, RenderResult } from '@testing-library/react';
