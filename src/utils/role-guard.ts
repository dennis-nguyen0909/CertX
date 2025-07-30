import { notFound } from "next/navigation";

export function guardRoles(
  allowedRoles: string[] | undefined,
  currentRole: string | null | undefined
) {
  // Only check access if role is loaded and there are role restrictions
  if (allowedRoles && currentRole !== null && currentRole !== undefined) {
    if (!allowedRoles.includes(currentRole.toUpperCase())) {
      notFound();
    }
  }
}
