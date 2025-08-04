"use client";

import { useState, useEffect } from "react";
import { CertificateVerifyForm } from "./components/certificate-verify-form";
import { DegreeVerifyForm } from "./components/degree-verify-form";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useGuardRoute } from "@/hooks/use-guard-route";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { HeaderLocaleSwitcher } from "@/components/header-locale-switcher";

export default function CertificateVerifyPage() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();
  const ipfsUrl = searchParams.get("ipfsUrl");
  const typeParam = searchParams.get("type");
  useGuardRoute();

  const [type, setType] = useState<string>(typeParam || "certificate");

  useEffect(() => {
    if (typeParam && typeParam !== type) {
      setType(typeParam);
    }
  }, [type, typeParam]);

  const handleTypeChange = (newType: string) => {
    setType(newType);
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set("type", newType);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const renderForm = () => {
    if (type === "degree") {
      return <DegreeVerifyForm initialValue={ipfsUrl || ""} />;
    }
    return <CertificateVerifyForm initialValue={ipfsUrl || ""} />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-end">
        <HeaderLocaleSwitcher />
      </div>
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
        <div className="mt-8 flex justify-center">
          <div className="flex items-center bg-white shadow-md rounded-lg px-6 py-4 border border-gray-200">
            <label
              htmlFor="type-select"
              className="mr-4 text-base font-semibold text-gray-700"
            >
              {t("certificateVerify.selectTypeLabel")}
            </label>
            <Select value={type} onValueChange={handleTypeChange}>
              <SelectTrigger
                id="type-select"
                className="w-56 focus:ring-2 focus:ring-blue-500"
              >
                <SelectValue
                  placeholder={t("certificateVerify.selectTypePlaceholder")}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="certificate">
                  {t("certificateVerify.type.certificate")}
                </SelectItem>
                <SelectItem value="degree">
                  {t("certificateVerify.type.degree")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-8">{renderForm()}</div>
      </div>
    </div>
  );
}
