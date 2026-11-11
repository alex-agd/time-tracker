import { useEffect, useState } from 'react';

/** Текущее время, обновляемое раз в intervalMs; пока enabled=false, таймер не крутится */
export const useNow = (enabled: boolean, intervalMs = 1000): number => {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!enabled) return;
    const id = window.setInterval(() => setNow(Date.now()), intervalMs);
    return () => window.clearInterval(id);
  }, [enabled, intervalMs]);

  return now;
};
