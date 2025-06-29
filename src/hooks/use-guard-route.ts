import { usePathname } from "next/navigation";
import { getRolesForPath } from "@/hooks/use-nav-data";
import { guardRoles } from "@/utils/role-guard";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export function useGuardRoute() {
  const role = useSelector((state: RootState) => state.user.role);
  const pathname = usePathname();
  // Loại bỏ prefix locale (ví dụ: /vi, /en)
  const normalizedPath = pathname.replace(/^\/(vi|en)(?=\/|$)/, "");
  const allowedRoles = getRolesForPath(normalizedPath || "/");
  guardRoles(allowedRoles, role);
}
