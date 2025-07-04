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
      console.log("role", role);
      if (role === "STUDENT") {
        router.push("/login-student");
      } else {
        router.push("/login");
      }
    }
  }, [isAuthenticated, router, isLoading, role]);

  if (isLoading || !isAuthenticated) {
    return null;
  }

  return children;
}
