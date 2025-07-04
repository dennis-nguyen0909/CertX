import { useServices } from "@/services";
import { useQuery } from "@tanstack/react-query";
import type { UseQueryOptions, QueryKey } from "@tanstack/react-query";
import { Log } from "@/models/log";
import { PaginatedListResponse } from "@/models/common";

// Lấy log theo role (mặc định)
export function useListLog(
  params: {
    page?: number;
    size?: number;
    role?: string;
    actionType?: string;
    startDate?: string;
    endDate?: string;
  },
  options: Partial<
    UseQueryOptions<
      PaginatedListResponse<Log>,
      unknown,
      PaginatedListResponse<Log>,
      QueryKey
    >
  > = {}
) {
  const { LogService } = useServices();
  const {
    page = 1,
    size = 10,
    role = "",
    actionType,
    startDate,
    endDate,
  } = params;
  return useQuery({
    queryKey: ["log-list", page, size, role, actionType, startDate, endDate],
    queryFn: () =>
      LogService.getListLog(page, size, role, actionType, startDate, endDate),
    ...options,
  });
}

// Lấy log theo department
export function useDepartmentLog(
  params: {
    page?: number;
    size?: number;
    departmentId?: number;
    actionType?: string;
    startDate?: string;
    endDate?: string;
  },
  options: Partial<
    UseQueryOptions<
      PaginatedListResponse<Log>,
      unknown,
      PaginatedListResponse<Log>,
      QueryKey
    >
  > = {}
) {
  const { LogService } = useServices();
  const {
    page = 1,
    size = 10,
    departmentId,
    actionType,
    startDate,
    endDate,
  } = params;
  return useQuery({
    queryKey: [
      "log-department",
      page,
      size,
      departmentId,
      actionType,
      startDate,
      endDate,
    ],
    queryFn: () =>
      LogService.getDepartmentLog(
        page,
        size,
        departmentId,
        actionType,
        startDate,
        endDate
      ),
    ...options,
  });
}

// Lấy log theo id
export function useLogById(id: string) {
  const { LogService } = useServices();
  return useQuery({
    queryKey: ["log-by-id", id],
    queryFn: () => LogService.getLogById(id),
    enabled: !!id,
  });
}

// Lấy log theo khoa
export function useKhoaLog({ page = 1, size = 10 }) {
  const { LogService } = useServices();
  return useQuery({
    queryKey: ["log-khoa", page, size],
    queryFn: () => LogService.getKhoaLog(page, size),
  });
}
