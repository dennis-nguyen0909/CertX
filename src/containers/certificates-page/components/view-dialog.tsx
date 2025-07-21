"use client";
import { useTranslation } from "react-i18next";
import { Image, Modal } from "antd";
import { useCertificatesDetail } from "@/hooks/certificates/use-certificates-detail";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";
import ConfirmationDialog from "@/components/confirmation-dialog";
import { usePaymentForExportPdf } from "@/hooks/student/use-payment-for-export-pdf";
interface ViewDialogProps {
  open: boolean;
  id: number;
  onClose?: () => void;
}

export function ViewDialog({ open, id, onClose }: ViewDialogProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    data: certificate,
    isPending,
    error,
    refetch,
  } = useCertificatesDetail(id);

  const [isConfirmExportOpen, setIsConfirmExportOpen] = useState(false);
  const { mutate: mutateStudent, isPending: isLoadingExport } =
    usePaymentForExportPdf();
  useEffect(() => {
    if (open && id) {
      refetch();
    }
  }, [open, id, refetch]);

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      router.push(window.location.pathname);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const exportPDF = async () => {
    if (!certificate?.studentId) {
      console.error("Missing studentId for export PDF");
      return;
    }

    mutateStudent(certificate.studentId.toString(), {
      onSuccess: async () => {
        const input = document.getElementById("pdf-content");
        if (!input) return;

        try {
          // Tạo canvas với padding
          const padding = 24; // px, padding cho mỗi phía
          const originalRect = input.getBoundingClientRect();
          const paddedWidth = originalRect.width + padding * 2;
          const paddedHeight = originalRect.height + padding * 2;

          // Tạo một div tạm thời để wrap nội dung với padding
          const wrapper = document.createElement("div");
          wrapper.style.padding = `${padding}px`;
          wrapper.style.background = "#fff";
          wrapper.style.width = `${originalRect.width}px`;
          wrapper.style.height = `${originalRect.height}px`;
          wrapper.appendChild(input.cloneNode(true));

          document.body.appendChild(wrapper);

          const canvas = await html2canvas(wrapper, {
            useCORS: true,
            scale: 2,
            ignoreElements: (element) => {
              return element.classList.contains("no-pdf");
            },
            onclone: (documentClone) => {
              // Remove elements that might cause issues, e.g., interactive elements
              const elementsToRemove =
                documentClone.querySelectorAll(".remove-on-pdf");
              elementsToRemove.forEach((el) => el.remove());
            },
            width: paddedWidth,
            height: paddedHeight,
          });

          // Xóa wrapper tạm thời sau khi render xong
          document.body.removeChild(wrapper);

          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF("p", "pt", "a4");
          const imgWidth = 595.28; // A4 width in pt (210mm)
          const pageHeight = 841.89; // A4 height in pt (297mm)
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          let heightLeft = imgHeight;
          let position = 0;

          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;

          while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
          }
          pdf.save("export.pdf");
        } catch (error) {
          console.error("Lỗi export PDF:", error);
        }
      },
      onError: (error) => {
        // Handle error, e.g., show notification
        console.error("Lỗi khi thanh toán và xuất PDF:", error);
      },
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
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "đã duyệt":
        return "bg-green-100 text-green-800";
      case "chưa duyệt":
        return "bg-blue-100 text-blue-800";
      case "đã từ chối":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      title={t("certificates.viewDetail")}
      width={1000}
      styles={{ body: { maxHeight: "80vh", overflowY: "auto" } }}
      destroyOnHidden
    >
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

      {certificate && (
        <div className="space-y-6">
          {/* Student Information */}
          <div id="pdf-content">
            {/* Certificate Image */}
            <div className="flex justify-center">
              {certificate.image_url ? (
                <Image
                  src={certificate.image_url}
                  alt="Certificate"
                  className="max-w-full h-auto border rounded-lg shadow-lg"
                  width={600}
                  height={400}
                  preview={{
                    zIndex: 1050,
                    getContainer: () => document.body,
                  }}
                />
              ) : (
                <p>---</p>
              )}
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                {t("certificates.basicInformation")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {t("certificates.nameStudent")}
                  </label>
                  <p className="text-base font-medium">
                    {certificate.nameStudent || <span>---</span>}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {t("certificates.studentCode")}
                  </label>
                  <p className="text-base font-mono">
                    {certificate.studentCode || <span>---</span>}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {t("certificates.birthDate")}
                  </label>
                  <p className="text-base">
                    {certificate.birthDate ? (
                      formatDate(certificate.birthDate)
                    ) : (
                      <span>---</span>
                    )}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {t("common.email")}
                  </label>
                  <p className="text-base">
                    {certificate.email || <span>---</span>}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {t("certificates.classStudent")}
                  </label>
                  <p className="text-base">
                    {certificate.studentClass || <span>---</span>}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {t("certificates.course")}
                  </label>
                  <p className="text-base">
                    {certificate.course || <span>---</span>}
                  </p>
                </div>
              </div>
            </div>

            {/* Certificate Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                {t("certificates.certificateInformation")}
              </h3>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  {t("certificates.certificateName")}
                </label>
                <p className="text-base font-medium">
                  {certificate.certificateName || <span>---</span>}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {t("certificates.department")}
                  </label>
                  <p className="text-base">
                    {certificate.department || <span>---</span>}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {t("certificates.university")}
                  </label>
                  <p className="text-base">
                    {certificate.university || <span>---</span>}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {t("certificates.diplomaNumber")}
                  </label>
                  <p className="text-base font-mono">
                    {certificate.diplomaNumber || <span>---</span>}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {t("certificates.status")}
                  </label>
                  <p className="text-base">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        certificate.status || ""
                      )}`}
                    >
                      {certificate.status || t("common.unknown")}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {t("certificates.issueDate")}
                  </label>
                  <p className="text-base">
                    {certificate.issueDate ? (
                      formatDate(certificate.issueDate)
                    ) : (
                      <span>---</span>
                    )}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {t("common.createdAt")}
                  </label>
                  <p className="text-base">
                    {certificate.createdAt ? (
                      formatDateTime(certificate.createdAt)
                    ) : (
                      <span>---</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
            {/* Blockchain Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                {t("certificates.blockchainInformation")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {t("certificates.transactionHash")}
                  </label>
                  <p className="text-base font-mono break-all">
                    {certificate.transactionHash || <span>---</span>}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {t("certificates.ipfsUrl")}
                  </label>
                  <p className="text-base">
                    {certificate.ipfsUrl ? (
                      <a
                        href={certificate.ipfsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline break-all"
                      >
                        {certificate.ipfsUrl}
                      </a>
                    ) : (
                      <span>---</span>
                    )}
                  </p>
                </div>
                <div className="flex flex-col justify-start">
                  <label className="text-sm font-medium text-gray-500">
                    {t("certificates.qrCode")}
                  </label>
                  {certificate.qrCodeUrl ? (
                    <Image
                      src={
                        certificate.qrCodeUrl.startsWith("data:")
                          ? certificate.qrCodeUrl
                          : `data:image/png;base64,${certificate.qrCodeUrl}`
                      }
                      alt="QR Code"
                      width={250}
                      height={250}
                      className="z-[1000]"
                      preview={{
                        zIndex: 1050,
                        getContainer: () => document.body,
                      }}
                    />
                  ) : (
                    <p>---</p>
                  )}
                </div>
              </div>
            </div>
            {/* Authority Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                {t("certificates.authorityInformation")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {t("certificates.grantorInfo")}
                  </label>
                  <p className="text-base">
                    {certificate.grantor || <span>---</span>}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {t("certificates.signerInfo")}
                  </label>
                  <p className="text-base">
                    {certificate.signer || <span>---</span>}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button onClick={handleClose}>{t("common.close")}</Button>
          </div>
          <div className="flex justify-end pt-4 border-t">
            <Button
              onClick={() => {
                setIsConfirmExportOpen(true);
              }}
            >
              Xuất PDF
            </Button>
          </div>
        </div>
      )}
      <ConfirmationDialog
        open={isConfirmExportOpen}
        onOpenChange={setIsConfirmExportOpen}
        title={"Xuất PDF"}
        description={"Bạn sẽ tiêu tốn 1 STUCOIN khi xuất pdf"}
        onConfirm={exportPDF}
        confirmText={t("common.confirm")}
        cancelText={t("common.cancel")}
        zIndex={1050}
        loading={isLoadingExport}
      />
    </Modal>
  );
}
