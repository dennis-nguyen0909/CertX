"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export function AuthRedirect({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const role = useSelector((state: RootState) => state.user.role);

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push("/login");
    }
  }, [isAuthenticated, router, isLoading, role]);

  if (isLoading || !isAuthenticated) {
    return null;
  }

  return children;
}

export function AuthStudentRedirect({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const role = useSelector((state: RootState) => state.user.role);

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push("/login-student");
    }
  }, [isAuthenticated, router, isLoading, role]);

  if (isLoading || !isAuthenticated) {
    return null;
  }

  return children;
}
