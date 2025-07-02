"use client";
import { Award, Clock } from "lucide-react";
import { useCertificatesStudentList } from "@/hooks/certificates/use-certificates-student-list";
import { useTranslation } from "react-i18next";

type Certificate = {
  id: number;
  nameStudent?: string;
  className?: string;
  department?: string;
  issueDate?: string;
  status?: string;
  diplomaNumber?: string;
  certificateName?: string;
  createdAt?: string;
  name?: string;
};

export default function StudentCertificatesPage() {
  const { t } = useTranslation();
  const { data: certificatesList, isLoading } = useCertificatesStudentList({
    page: 1,
    size: 10,
  });
  const certificates: Certificate[] = certificatesList?.items || [];

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <h2 className="text-3xl font-extrabold mb-10 text-gray-900 tracking-tight text-center drop-shadow">
        {t("studentCertificates.title")}
      </h2>
      {isLoading ? (
        <div className="text-center text-gray-500 py-10 text-lg animate-pulse">
          {t("studentCertificates.loading")}
        </div>
      ) : certificates.length === 0 ? (
        <div className="text-center text-gray-500 py-10 text-lg">
          {t("studentCertificates.noData")}
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((c: Certificate) => (
            <div
              key={c.id}
              className="group border-2 border-transparent bg-white rounded-3xl p-7 flex flex-col gap-4 shadow-xl hover:shadow-2xl hover:scale-[1.03] transition-all duration-200 cursor-pointer min-h-[200px] relative overflow-hidden hover:border-primary/40"
              style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)" }}
            >
              <div className="flex items-center gap-4 mb-2">
                <span className="rounded-full bg-primary/10 p-2">
                  {c.status === "Đã duyệt" ? (
                    <Award className="text-green-500" size={36} />
                  ) : (
                    <Clock className="text-yellow-500" size={36} />
                  )}
                </span>
                <div className="font-bold text-xl text-gray-800 group-hover:text-primary transition-colors truncate">
                  {c.certificateName || c.name}
                </div>
              </div>
              <div className="flex flex-col gap-1 text-base text-gray-600">
                <div>
                  <span className="font-medium text-gray-700">
                    {t("studentCertificates.issueDate")}:
                  </span>{" "}
                  {c.issueDate}
                </div>
                <div>
                  <span className="font-medium text-gray-700">
                    {t("studentCertificates.diplomaNumber")}:
                  </span>{" "}
                  {c.diplomaNumber}
                </div>
                <div>
                  <span className="font-medium text-gray-700">
                    {t("studentCertificates.className")}:
                  </span>{" "}
                  {c.className}
                </div>
                <div>
                  <span className="font-medium text-gray-700">
                    {t("studentCertificates.department")}:
                  </span>{" "}
                  {c.department}
                </div>
              </div>
              <div className="mt-auto flex justify-end">
                <span
                  className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold tracking-wide shadow-md transition-all duration-150
                    ${
                      c.status === "Đã duyệt"
                        ? "bg-gradient-to-r from-green-400 to-green-600 text-white"
                        : "bg-gradient-to-r from-yellow-300 to-yellow-500 text-yellow-900"
                    }
                  `}
                >
                  {c.status}
                </span>
              </div>
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/10 rounded-full blur-2xl opacity-60 group-hover:opacity-80 transition-all duration-200" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
