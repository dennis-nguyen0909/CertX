export type GuardResult = {
  status: "loading" | "allowed" | "forbidden";
};

export function checkRoleAccess(
  allowedRoles: string[] | undefined,
  currentRole: string | null | undefined
): GuardResult {
  // If no role restrictions, allow access
  if (!allowedRoles) {
    return { status: "allowed" };
  }

  // If role is not yet loaded, show loading
  if (currentRole === null || currentRole === undefined) {
    return { status: "loading" };
  }

  // Check if current role has access
  if (allowedRoles.includes(currentRole.toUpperCase())) {
    return { status: "allowed" };
  }

  // Role is loaded but doesn't have access
  return { status: "forbidden" };
}

// Legacy function for backward compatibility
export function guardRoles(
  allowedRoles: string[] | undefined,
  currentRole: string | null | undefined
) {
  const result = checkRoleAccess(allowedRoles, currentRole);

  if (result.status === "forbidden") {
    throw new Error("Access forbidden");
  }
}
