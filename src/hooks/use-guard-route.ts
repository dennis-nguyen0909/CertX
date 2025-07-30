import { usePathname } from "next/navigation";
import { getRolesForPath } from "@/hooks/use-nav-data";
import { checkRoleAccess, GuardResult } from "@/utils/role-guard";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export function useGuardRoute(): GuardResult {
  const role = useSelector((state: RootState) => state.user.role);
  const pathname = usePathname();
  // Loại bỏ prefix locale (ví dụ: /vi, /en)
  const normalizedPath = pathname.replace(/^\/(vi|en)(?=\/|$)/, "");
  const allowedRoles = getRolesForPath(normalizedPath || "/");
  return checkRoleAccess(allowedRoles, role);
}
