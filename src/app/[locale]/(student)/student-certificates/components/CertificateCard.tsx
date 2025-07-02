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
  currentPage,
  totalPages,
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
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {t("studentCertificates.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("studentCertificates.total", {
            count: total ?? certificates.length,
          })}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((certificate) => (
          <Card
            key={certificate.id}
            onClick={() => handleCardClick(certificate.id)}
            className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-primary cursor-pointer"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">
                    {t("studentCertificates.certificateName")} #{certificate.id}
                  </CardTitle>
                </div>
                <Badge
                  variant={getStatusVariant(certificate.status || "")}
                  className="text-xs"
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

      <div className="text-center text-sm text-muted-foreground">
        Trang {currentPage ?? 1} / {totalPages ?? 1}
      </div>

      <ViewDialog open={open} id={selectedId ?? 0} onClose={handleClose} />
    </div>
  );
}
