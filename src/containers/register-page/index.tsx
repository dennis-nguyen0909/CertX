"use client";

import { useAuth } from "@/contexts/auth";
import { RegisterForm } from "./components/register-form";
import { redirect } from "next/navigation";

export default function RegisterPage() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return redirect("/");
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  );
}
