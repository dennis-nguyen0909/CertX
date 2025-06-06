"use client";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCertificatesDetail } from "@/hooks/certificates/use-certificates-detail";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface ViewDialogProps {
  open: boolean;
  id: number;
}

export function ViewDialog({ open, id }: ViewDialogProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    mutate: getCertificateDetail,
    data: certificate,
    isPending,
    error,
  } = useCertificatesDetail();

  useEffect(() => {
    if (open && id) {
      getCertificateDetail(id);
    }
  }, [open, id, getCertificateDetail]);

  const handleClose = () => {
    router.push(window.location.pathname);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("certificates.viewDetail")}</DialogTitle>
        </DialogHeader>

        {isPending && (
          <div className="flex items-center justify-center py-8">
            <Loader className="h-6 w-6 animate-spin" />
            <span className="ml-2">{t("common.loading")}</span>
          </div>
        )}

        {error && (
          <div className="text-red-500 text-center py-4">
            {t("common.errorOccurred")}
          </div>
        )}

        {certificate?.data && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  {t("certificates.nameStudent")}
                </label>
                <p className="text-base font-medium">
                  {certificate.data.nameStudent}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  {t("certificates.className")}
                </label>
                <p className="text-base">{certificate.data.className}</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">
                {t("certificates.certificateName")}
              </label>
              <p className="text-base font-medium">
                {certificate.data.certificateName}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  {t("certificates.department")}
                </label>
                <p className="text-base">{certificate.data.department}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  {t("certificates.diplomaNumber")}
                </label>
                <p className="text-base font-mono">
                  {certificate.data.diploma_number}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  {t("certificates.issueDate")}
                </label>
                <p className="text-base">
                  {formatDate(certificate.data.issueDate)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  {t("common.createdAt")}
                </label>
                <p className="text-base">
                  {formatDateTime(certificate.data.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={handleClose}>{t("common.close")}</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
