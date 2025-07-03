import { useServices } from "@/services";
import { useQuery } from "@tanstack/react-query";

// Lấy log theo role (mặc định)
export function useListLog({
  page = 1,
  size = 10,
  role = "",
  actionType,
  startDate,
  endDate,
}: {
  page?: number;
  size?: number;
  role?: string;
  actionType?: string;
  startDate?: string;
  endDate?: string;
}) {
  const { LogService } = useServices();
  return useQuery({
    queryKey: ["log-list", page, size, role, actionType, startDate, endDate],
    queryFn: () =>
      LogService.getListLog(page, size, role, actionType, startDate, endDate),
  });
}

// Lấy log theo department
export function useDepartmentLog({ page = 1, size = 10 }) {
  const { LogService } = useServices();
  return useQuery({
    queryKey: ["log-department", page, size],
    queryFn: () => LogService.getDepartmentLog(page, size),
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
