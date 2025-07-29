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
import { usePaymentForExportPdf } from "@/hooks/student/use-payment-for-export-pdf";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { isAxiosError } from "axios";

interface ViewDialogProps {
  open: boolean;
  id: number;
  onClose?: () => void;
}

const DetailRow: React.FC<{
  label: string;
  value?: React.ReactNode;
  isLink?: boolean;
}> = ({ label, value, isLink = false }) => (
  <div>
    <label className="text-sm font-medium text-gray-500">{label}</label>
    {isLink ? (
      typeof value === "string" || value == null ? (
        <p className="text-base break-words">{value || "---"}</p>
      ) : (
        <div className="text-base break-words">{value}</div>
      )
    ) : (
      <p className="text-base break-words">{value || "---"}</p>
    )}
  </div>
);

export function ViewDialog({ open, id, onClose }: ViewDialogProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    data: certificate,
    isPending,
    error,
    refetch,
  } = useCertificatesDetail(id);
  const role = useSelector((state: RootState) => state.user.role);
  const {
    mutate: mutateStudent,
    isPending: isLoadingExport,
    error: errorExport,
  } = usePaymentForExportPdf();

  const [isExportPdfModalOpen, setIsExportPdfModalOpen] = useState(false);

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

    mutateStudent(undefined, {
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
            ignoreElements: (element: Element) => {
              return element.classList.contains("no-pdf");
            },
            onclone: (documentClone: Document) => {
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
      onError: (error: unknown) => {
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
        return "bg-green-100 text-green-800 border-green-200";
      case "chưa duyệt":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "đã từ chối":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
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
      zIndex={1040}
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
                <DetailRow
                  label={t("certificates.nameStudent")}
                  value={certificate.nameStudent}
                />
                <DetailRow
                  label={t("certificates.studentCode")}
                  value={certificate.studentCode}
                />
                <DetailRow
                  label={t("certificates.birthDate")}
                  value={
                    certificate.birthDate
                      ? formatDate(certificate.birthDate)
                      : undefined
                  }
                />
                <DetailRow
                  label={t("common.email")}
                  value={certificate.email}
                />
                <DetailRow
                  label={t("certificates.classStudent")}
                  value={certificate.studentClass}
                />
                <DetailRow
                  label={t("certificates.course")}
                  value={certificate.course}
                />
              </div>
            </div>

            {/* Certificate Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                {t("certificates.certificateInformation")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailRow
                  label={t("certificates.certificateName")}
                  value={certificate.certificateName}
                />
                <DetailRow
                  label={t("certificates.department")}
                  value={certificate.department}
                />
                <DetailRow
                  label={t("certificates.university")}
                  value={certificate.university}
                />
                <DetailRow
                  label={t("certificates.diplomaNumber")}
                  value={certificate.diplomaNumber}
                />
                <DetailRow
                  label={t("common.createdAt")}
                  value={
                    certificate.createdAt
                      ? formatDateTime(certificate.createdAt)
                      : undefined
                  }
                />
                <DetailRow
                  label={t("certificates.status")}
                  value={
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        certificate.status || ""
                      )}`}
                    >
                      {certificate.status || t("common.unknown")}
                    </span>
                  }
                />
                <DetailRow
                  label={t("certificates.issueDate")}
                  value={
                    certificate.issueDate
                      ? formatDate(certificate.issueDate)
                      : undefined
                  }
                />
                {certificate?.rejectedNote && (
                  <DetailRow
                    label={t("common.rejectNoteLabel")}
                    value={
                      <div className=" text-red-700">
                        {certificate?.rejectedNote}
                      </div>
                    }
                  />
                )}
              </div>
            </div>
            {/* Blockchain Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                {t("certificates.blockchainInformation")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailRow
                  label={t("certificates.transactionHash")}
                  value={certificate.transactionHash}
                />
                <DetailRow
                  label={t("certificates.ipfsUrl")}
                  isLink
                  value={
                    certificate.ipfsUrl ? (
                      <a
                        href={certificate.ipfsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline break-all"
                      >
                        {certificate.ipfsUrl}
                      </a>
                    ) : undefined
                  }
                />
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
                      width={150}
                      height={150}
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
                <DetailRow
                  label={t("certificates.grantorInfo")}
                  value={certificate.grantor}
                />
                <DetailRow
                  label={t("certificates.signerInfo")}
                  value={certificate.signer}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button onClick={handleClose} variant="outline">
              {t("common.close")}
            </Button>
            {certificate.ipfsUrl && (
              <Button
                onClick={() => {
                  let ipfsToUse = certificate.ipfsUrl;
                  try {
                    if (certificate.ipfsUrl) {
                      const url = new URL(certificate.ipfsUrl);
                      const pathSegments = url.pathname.split("/ipfs/");
                      if (pathSegments.length > 1) {
                        ipfsToUse = pathSegments[1]; // Get the part after '/ipfs/'
                      } else {
                        // If '/ipfs/' is not found, take the whole path (removing leading slash)
                        ipfsToUse = url.pathname.startsWith("/")
                          ? url.pathname.substring(1)
                          : url.pathname;
                      }
                    }
                  } catch (e) {
                    console.error("Invalid IPFS URL or parsing error:", e);
                    ipfsToUse = certificate.ipfsUrl; // Fallback to full URL
                  }
                  router.push(
                    `/verification?ipfsUrl=${ipfsToUse}&type=certificate`
                  );
                }}
              >
                Xác minh chứng chỉ
              </Button>
            )}
            {role === "STUDENT" && (
              <Button onClick={() => setIsExportPdfModalOpen(true)}>
                Xuất PDF
              </Button>
            )}
          </div>
        </div>
      )}

      <Modal
        title="Xuất PDF"
        open={isExportPdfModalOpen}
        onOk={exportPDF}
        onCancel={() => setIsExportPdfModalOpen(false)}
        confirmLoading={isLoadingExport}
        centered={true}
        okText={t("common.confirm")}
        cancelText={t("common.cancel")}
        zIndex={2000}
      >
        <p>Bạn sẽ tiêu tốn 1 STUCOIN khi xuất pdf</p>
        {isAxiosError(errorExport) && (
          <div className="text-red-500 text-center py-4">
            {errorExport.response?.data?.message || t("common.errorOccurred")}
          </div>
        )}
      </Modal>
    </Modal>
  );
}
