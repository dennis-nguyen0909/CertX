"use client";

import ForgotForm from "./components/forgot-form";
import Image from "next/image";
import STULogo from "../../../public/logos/Logo_STU.png";

export default function StudentForgotPasswordPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6 w-full max-w-md mx-auto">
          <div className="flex justify-center mb-2">
            <Image
              src={STULogo}
              alt="STU Logo"
              width={180}
              height={60}
              priority
            />
          </div>
          <ForgotForm />
        </div>
      </div>
    </div>
  );
}
