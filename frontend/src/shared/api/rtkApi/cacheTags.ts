import { timeTrackerApi } from './endpoints/timeTrackerApi';

// Codegen вешает теги по OpenAPI-тегу контроллера; таймер меняет и список сотрудников, и отчёты
const TIMER_SIDE_EFFECTS = ['Employees', 'TimeEntries', 'Reports'] as const;

export const api = timeTrackerApi.enhanceEndpoints({
  addTagTypes: [...TIMER_SIDE_EFFECTS],
  endpoints: {
    createEmployee: { invalidatesTags: ['Employees', 'Reports'] },
    startTimer: { invalidatesTags: [...TIMER_SIDE_EFFECTS] },
    stopTimer: { invalidatesTags: [...TIMER_SIDE_EFFECTS] },
  },
});

export const {
  useGetEmployeesQuery,
  useCreateEmployeeMutation,
  useStartTimerMutation,
  useStopTimerMutation,
  useGetTimeEntriesQuery,
  useGetReportSummaryQuery,
} = api;

export type {
  CreateEmployeeRequest,
  EmployeeResponse,
  EmployeeTotal,
  ReportResponse,
  TimeEntryResponse,
} from './endpoints/timeTrackerApi';
