"use client";

import { CertificateVerifyForm } from "./components/certificate-verify-form";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { DegreeVerifyForm } from "./components/degree-verify-form";

export default function CertificateVerifyPage() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const ipfsUrl = searchParams.get("ipfsUrl");
  const type = searchParams.get("type");
  console.log("type", type);

  const renderForm = () => {
    if (type === "degree") {
      return <DegreeVerifyForm initialValue={ipfsUrl || ""} />;
    }
    return <CertificateVerifyForm initialValue={ipfsUrl || ""} />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black sm:text-4xl">
            {t(
              `${
                type === "degree" ? "degreeVerify" : "certificateVerify"
              }.title`
            )}
          </h1>
          <p className="mt-3 text-xl text-gray-600">
            {t(
              `${
                type === "degree" ? "degreeVerify" : "certificateVerify"
              }.subtitle`
            )}
          </p>
        </div>
        {renderForm()}
      </div>
    </div>
  );
}
