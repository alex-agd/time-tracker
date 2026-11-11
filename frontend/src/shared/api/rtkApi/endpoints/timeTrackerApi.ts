import { baseApi as api } from '../baseApi';
export const addTagTypes = ['Employees', 'Timer', 'TimeEntries', 'Reports'] as const;
const injectedRtkApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getEmployees: build.query<GetEmployeesApiResponse, GetEmployeesApiArg>({
        query: () => ({ url: `/api/employees` }),
        providesTags: ['Employees'],
      }),
      createEmployee: build.mutation<CreateEmployeeApiResponse, CreateEmployeeApiArg>({
        query: (queryArg) => ({
          url: `/api/employees`,
          method: 'POST',
          body: queryArg,
        }),
        invalidatesTags: ['Employees'],
      }),
      stopTimer: build.mutation<StopTimerApiResponse, StopTimerApiArg>({
        query: (queryArg) => ({
          url: `/api/employees/${queryArg}/timer/stop`,
          method: 'POST',
        }),
        invalidatesTags: ['Timer'],
      }),
      startTimer: build.mutation<StartTimerApiResponse, StartTimerApiArg>({
        query: (queryArg) => ({
          url: `/api/employees/${queryArg.employeeId}/timer/start`,
          method: 'POST',
          body: queryArg.startTimerRequest,
        }),
        invalidatesTags: ['Timer'],
      }),
      getTimeEntries: build.query<GetTimeEntriesApiResponse, GetTimeEntriesApiArg>({
        query: (queryArg) => ({
          url: `/api/time-entries`,
          params: {
            employeeId: queryArg.employeeId,
            from: queryArg['from'],
            to: queryArg.to,
          },
        }),
        providesTags: ['TimeEntries'],
      }),
      getReportSummary: build.query<GetReportSummaryApiResponse, GetReportSummaryApiArg>({
        query: (queryArg) => ({
          url: `/api/reports/summary`,
          params: {
            from: queryArg['from'],
            to: queryArg.to,
          },
        }),
        providesTags: ['Reports'],
      }),
    }),
    overrideExisting: false,
  });
export { injectedRtkApi as timeTrackerApi };
export type GetEmployeesApiResponse = /** status 200 OK */ EmployeeResponse[];
export type GetEmployeesApiArg = void;
export type CreateEmployeeApiResponse = /** status 201 Created */ EmployeeResponse;
export type CreateEmployeeApiArg = CreateEmployeeRequest;
export type StopTimerApiResponse = /** status 200 OK */ TimeEntryResponse;
export type StopTimerApiArg = number;
export type StartTimerApiResponse = /** status 201 Created */ TimeEntryResponse;
export type StartTimerApiArg = {
  employeeId: number;
  startTimerRequest: StartTimerRequest;
};
export type GetTimeEntriesApiResponse = /** status 200 OK */ TimeEntryResponse[];
export type GetTimeEntriesApiArg = {
  employeeId?: number;
  from: string;
  to: string;
};
export type GetReportSummaryApiResponse = /** status 200 OK */ ReportResponse;
export type GetReportSummaryApiArg = {
  from: string;
  to: string;
};
export type TimeEntryResponse = {
  id: number;
  employeeId: number;
  description: string;
  startedAt: string;
  /** null, пока таймер запущен */
  endedAt?: string;
  /** Длительность в секундах; для запущенного таймера — на момент ответа */
  durationSeconds: number;
};
export type EmployeeResponse = {
  id: number;
  fullName: string;
  position?: string;
  createdAt: string;
  /** Запущенный таймер, если есть */
  activeEntry?: TimeEntryResponse;
};
export type CreateEmployeeRequest = {
  fullName: string;
  position?: string;
};
export type StartTimerRequest = {
  description: string;
};
export type EmployeeTotal = {
  employeeId: number;
  fullName: string;
  position?: string;
  totalSeconds: number;
  entriesCount: number;
};
export type ReportResponse = {
  from: string;
  to: string;
  totalSeconds: number;
  employees: EmployeeTotal[];
};
export const {
  useGetEmployeesQuery,
  useLazyGetEmployeesQuery,
  useCreateEmployeeMutation,
  useStopTimerMutation,
  useStartTimerMutation,
  useGetTimeEntriesQuery,
  useLazyGetTimeEntriesQuery,
  useGetReportSummaryQuery,
  useLazyGetReportSummaryQuery,
} = injectedRtkApi;
