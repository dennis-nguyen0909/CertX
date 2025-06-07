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
  console.log("certificate", certificate);
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
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
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
          <div className="space-y-6">
            {/* Certificate Image */}
            {certificate.data.image_url && (
              <div className="flex justify-center">
                <img
                  src={certificate.data.image_url}
                  alt="Certificate"
                  className="max-w-full h-auto border rounded-lg shadow-lg"
                />
              </div>
            )}

            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                Thông tin cơ bản
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    Mã sinh viên
                  </label>
                  <p className="text-base font-mono">
                    {certificate.data.studentCode}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Lớp học
                  </label>
                  <p className="text-base">{certificate.data.studentClass}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Email
                  </label>
                  <p className="text-base">{certificate.data.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Ngày sinh
                  </label>
                  <p className="text-base">
                    {formatDate(certificate.data.birthDate)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Khóa học
                  </label>
                  <p className="text-base">{certificate.data.course}</p>
                </div>
              </div>
            </div>

            {/* Certificate Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                Thông tin chứng chỉ
              </h3>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  {t("certificates.certificateName")}
                </label>
                <p className="text-base font-medium">
                  {certificate.data.certificateName}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {t("certificates.department")}
                  </label>
                  <p className="text-base">{certificate.data.department}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Trường đại học
                  </label>
                  <p className="text-base">{certificate.data.university}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {t("certificates.diplomaNumber")}
                  </label>
                  <p className="text-base font-mono">
                    {certificate.data.diploma_number}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Mã QR
                  </label>
                  <p className="text-base font-mono">
                    {certificate.data.qrCodeUrl}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>

            {/* Authority Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                Thông tin cấp phát
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Người cấp
                  </label>
                  <p className="text-base">{certificate.data.grantor}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Người ký
                  </label>
                  <p className="text-base">{certificate.data.signer}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Button onClick={handleClose}>{t("common.close")}</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
