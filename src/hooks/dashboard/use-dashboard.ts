import { usePdtDashboard } from "./use-pdt-dashboard";
import { useKhoaDashboard } from "./use-khoa-dashboard";
import { useAdminDashboard } from "./use-admin-dashboard";
import { DashboardResponse } from "@/models/dashboard";
import { UseQueryResult } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export function useDashboard(): UseQueryResult<DashboardResponse, Error> {
  const role = useSelector((state: RootState) => state.user.role);

  const pdtDashboard = usePdtDashboard();
  const khoaDashboard = useKhoaDashboard();
  const adminDashboard = useAdminDashboard();

  // Return the appropriate dashboard based on role
  switch (role) {
    case "PDT":
      return pdtDashboard;
    case "KHOA":
      return khoaDashboard;
    case "ADMIN":
      return adminDashboard;
    default:
      // Return PDT dashboard as fallback or throw error
      return pdtDashboard;
  }
}
