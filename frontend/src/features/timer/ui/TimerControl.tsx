import React from 'react';
import { toast } from 'sonner';
import { type EmployeeResponse, useStartTimerMutation, useStopTimerMutation } from '@/src/shared/api/rtkApi/cacheTags';
import { getErrorMessage } from '@/src/shared/api/rtkApi/getErrorMessage';
import { formatDuration } from '@/src/shared/lib/time/formatDuration';
import { TimerControlView } from './TimerControlView';

interface TimerControlProps {
  employee: EmployeeResponse;
}

export const TimerControl: React.FC<TimerControlProps> = ({ employee }) => {
  const [startTimer, startState] = useStartTimerMutation();
  const [stopTimer, stopState] = useStopTimerMutation();

  const handleStart = async (description: string) => {
    try {
      await startTimer({ employeeId: employee.id, startTimerRequest: { description } }).unwrap();
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error as Parameters<typeof getErrorMessage>[0], 'Не удалось запустить таймер'));
      return false;
    }
  };

  const handleStop = async () => {
    try {
      const entry = await stopTimer(employee.id).unwrap();
      toast.success(`${employee.fullName}: записано ${formatDuration(entry.durationSeconds)}`);
    } catch (error) {
      toast.error(getErrorMessage(error as Parameters<typeof getErrorMessage>[0], 'Не удалось остановить таймер'));
    }
  };

  return (
    <TimerControlView
      employeeName={employee.fullName}
      activeTimer={employee.activeEntry}
      pending={startState.isLoading || stopState.isLoading}
      onStart={handleStart}
      onStop={handleStop}
    />
  );
};
