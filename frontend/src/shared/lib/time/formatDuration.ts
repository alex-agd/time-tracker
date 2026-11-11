const pad = (value: number) => String(value).padStart(2, '0');

/** 3725 → «01:02:05» — для живого счётчика таймера */
export const formatClock = (totalSeconds: number): string => {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  return `${pad(hours)}:${pad(minutes)}:${pad(safe % 60)}`;
};

/** 3725 → «1 ч 02 мин» — для отчётов; меньше минуты показывается как «0 мин» */
export const formatDuration = (totalSeconds: number): string => {
  const totalMinutes = Math.floor(Math.max(0, totalSeconds) / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) {
    return `${minutes} мин`;
  }
  return `${hours} ч ${pad(minutes)} мин`;
};
