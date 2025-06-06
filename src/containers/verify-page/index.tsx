"use client";

import { VerifyForm } from "./components/verify-form";

export default function VerifyPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <VerifyForm />
      </div>
    </div>
  );
}
