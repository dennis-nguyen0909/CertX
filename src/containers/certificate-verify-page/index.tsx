"use client";

import { CertificateVerifyForm } from "./components/certificate-verify-form";
import { useSearchParams } from "next/navigation";

export default function CertificateVerifyPage() {
  const searchParams = useSearchParams();
  const ipfsUrl = searchParams.get("ipfsUrl");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black sm:text-4xl">
            Xác thực chứng chỉ
          </h1>
          <p className="mt-3 text-xl text-gray-600">
            Nhập URL hoặc Public ID để xác thực chứng chỉ của bạn
          </p>
        </div>
        <CertificateVerifyForm initialValue={ipfsUrl || ""} />
      </div>
    </div>
  );
}
