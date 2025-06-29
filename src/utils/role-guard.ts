import { notFound } from "next/navigation";

export function guardRoles(
  allowedRoles: string[] | undefined,
  currentRole: string | null | undefined
) {
  if (
    allowedRoles &&
    (!currentRole || !allowedRoles.includes(currentRole.toUpperCase()))
  ) {
    notFound();
  }
}
