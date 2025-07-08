"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Award,
  Calendar,
  GraduationCap,
  Hash,
  School,
  User,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { ViewDialog } from "@/containers/certificates-page/components/view-dialog";
import { useRouter, useSearchParams } from "next/navigation";

export type Certificate = {
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

type CertificateCardsProps = {
  certificates: Certificate[];
  total?: number;
  currentPage?: number;
  totalPages?: number;
};

const getStatusVariant = (status: string) => {
  switch (status) {
    case "Đã duyệt":
      return "default";
    case "Chờ duyệt":
      return "secondary";
    case "Từ chối":
      return "destructive";
    default:
      return "outline";
  }
};

const formatDate = (dateString?: string) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function CertificateCards({
  certificates,
  total,
}: CertificateCardsProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const idParam = searchParams.get("id");
  const open = !!idParam;
  const selectedId = idParam ? Number(idParam) : null;

  const handleCardClick = (id: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("id", id.toString());
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const handleClose = () => {
    const params = new URLSearchParams(window.location.search);
    params.delete("id");
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <h2 className="text-2xl font-bold mb-8 text-gray-900 text-center">
        {t("studentCertificates.title")}
      </h2>
      <p className="text-center text-muted-foreground mb-8">
        {t("studentCertificates.total", {
          count: total ?? certificates.length,
        })}
      </p>
      {/* isLoading ? (
        <div className="text-center text-gray-500 py-10">
          {t("studentCertificates.loading")}
        </div>
      ) : certificates.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          {t("studentCertificates.noData")}
        </div>
      ) : ( */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((certificate) => (
          <Card
            key={certificate.id}
            onClick={() => handleCardClick(certificate.id)}
            className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-primary cursor-pointer"
          >
            <CardHeader className="pb-3 min-h-[72px]">
              <div className="flex flex-col items-start gap-1 h-full w-full">
                <div className="flex items-center space-x-2 w-full">
                  <Award className="h-5 w-5 text-primary flex-shrink-0" />
                  <CardTitle
                    className="text-lg break-words whitespace-pre-line w-full"
                    style={{ wordBreak: "break-word", minHeight: 40 }}
                  >
                    {certificate.certificateName}
                  </CardTitle>
                </div>
                <Badge
                  variant={getStatusVariant(certificate.status || "")}
                  className="text-xs mt-2"
                >
                  {certificate.status}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="font-medium">{certificate.nameStudent}</p>
                    <p className="text-sm text-muted-foreground">
                      {t("studentCertificates.student")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <GraduationCap className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="font-medium">{certificate.className}</p>
                    <p className="text-sm text-muted-foreground">
                      {t("studentCertificates.className")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <School className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="font-medium">{certificate.department}</p>
                    <p className="text-sm text-muted-foreground">
                      {t("studentCertificates.department")}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Hash className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="font-medium font-mono text-sm">
                      {certificate.diplomaNumber}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t("studentCertificates.diplomaNumber")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="font-medium">
                      {formatDate(certificate.issueDate)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t("studentCertificates.issueDate")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground">
                  {t("common.createdAt")}: {formatDate(certificate.createdAt)}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <ViewDialog open={open} id={selectedId ?? 0} onClose={handleClose} />
    </div>
  );
}
