"use client";
import CertificateCards from "./components/CertificateCard";
import { useCertificatesStudentList } from "@/hooks/certificates/use-certificates-student-list";
import { useTranslation } from "react-i18next";

export default function StudentCertificatesPage() {
  const { t } = useTranslation();
  const { data: certificatesList, isLoading } = useCertificatesStudentList({
    page: 1,
    size: 10,
  });
  const certificates = certificatesList?.items || [];
  const meta = certificatesList?.meta;

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      {isLoading ? (
        <div className="text-center text-gray-500 py-10 text-lg animate-pulse">
          {t("studentCertificates.loading")}
        </div>
      ) : certificates.length === 0 ? (
        <div className="text-center text-gray-500 py-10 text-lg">
          {t("studentCertificates.noData")}
        </div>
      ) : (
        <CertificateCards
          certificates={certificates}
          total={meta?.total}
          currentPage={meta?.current_page}
          totalPages={meta?.total_pages}
        />
      )}
    </div>
  );
}
