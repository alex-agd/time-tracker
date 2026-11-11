import '@testing-library/jest-dom/vitest';

class ResizeObserverMock {
  observe = () => undefined;
  unobserve = () => undefined;
  disconnect = () => undefined;
}
global.ResizeObserver = ResizeObserverMock;
