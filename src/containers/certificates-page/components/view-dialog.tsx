"use client";
import { useTranslation } from "react-i18next";
import { Image, Modal } from "antd";
import { useCertificatesDetail } from "@/hooks/certificates/use-certificates-detail";
import { useEffect, useState, useRef } from "react";
import { InfoIcon, Loader } from "lucide-react";
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

  // Use a ref to the content to export
  const pdfContentRef = useRef<HTMLDivElement>(null);

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

  // Fix xuất PDF: clone node, set width, ensure QR code is fully visible, and handle multi-page
  const exportPDF = async () => {
    if (!certificate?.studentId) {
      console.error("Missing studentId for export PDF");
      return;
    }

    mutateStudent(undefined, {
      onSuccess: async () => {
        const input = pdfContentRef.current;
        if (!input) return;

        try {
          // Clone the node to avoid layout issues
          const clone = input.cloneNode(true) as HTMLElement;
          // Remove all Ant Design image preview overlays if any
          const previewOverlays = clone.querySelectorAll(
            ".ant-image-preview-root"
          );
          previewOverlays.forEach((el) => el.remove());

          // Set a fixed width for the export (A4 width in px at 96dpi ~ 794px)
          clone.style.width = "794px";
          clone.style.maxWidth = "794px";
          clone.style.background = "#fff";
          clone.style.padding = "32px";
          clone.style.boxSizing = "border-box";

          // Ensure QR code is not cropped: force its parent to be visible and not overflow hidden
          const qrDivs = clone.querySelectorAll("img[alt='QR Code']");
          qrDivs.forEach((img) => {
            const parent = img.parentElement;
            if (parent) {
              (parent as HTMLElement).style.overflow = "visible";
              (parent as HTMLElement).style.maxWidth = "none";
            }
            (img as HTMLImageElement).removeAttribute("style");
            (img as HTMLImageElement).style.width = "150px";
            (img as HTMLImageElement).style.height = "150px";
            (img as HTMLImageElement).style.display = "block";
          });

          // Create a wrapper to render off-screen
          const wrapper = document.createElement("div");
          wrapper.style.position = "fixed";
          wrapper.style.left = "-9999px";
          wrapper.style.top = "0";
          wrapper.style.zIndex = "-1";
          wrapper.appendChild(clone);
          document.body.appendChild(wrapper);

          // Use html2canvas to render the full content
          const canvas = await html2canvas(clone, {
            useCORS: true,
            scale: 2,
            backgroundColor: "#fff",
            ignoreElements: (element: Element) => {
              return element.classList.contains("no-pdf");
            },
            onclone: (documentClone: Document) => {
              // Remove elements that might cause issues, e.g., interactive elements
              const elementsToRemove =
                documentClone.querySelectorAll(".remove-on-pdf");
              elementsToRemove.forEach((el) => el.remove());
            },
            // width and height are not set, let html2canvas auto-detect
            // This ensures the full content is rendered, including QR
          });

          document.body.removeChild(wrapper);

          // Calculate PDF page size and split if needed
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF("p", "pt", "a4");
          const pageWidth = pdf.internal.pageSize.getWidth();
          const pageHeight = pdf.internal.pageSize.getHeight();

          // Scale image to fit page width
          const imgWidth = pageWidth;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          let position = 0;
          let heightLeft = imgHeight;

          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;

          while (heightLeft > 0) {
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
        if (isAxiosError(error)) {
          console.error(
            "Lỗi khi thanh toán và xuất PDF:",
            error.message,
            error.response?.data
          );
        } else if (error instanceof Error) {
          console.error("Lỗi khi thanh toán và xuất PDF:", error.message);
        } else {
          console.error("Lỗi khi thanh toán và xuất PDF:", error);
        }
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
      zIndex={10}
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
          <div id="pdf-content" ref={pdfContentRef}>
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
                  value={
                    certificate.transactionHash ? (
                      <a
                        href={`https://sepolia.etherscan.io/tx/${certificate.transactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline break-all"
                      >
                        {certificate.transactionHash}
                      </a>
                    ) : (
                      "---"
                    )
                  }
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
        title={t("degree.exportPdfTitle")}
        open={isExportPdfModalOpen}
        onOk={exportPDF}
        onCancel={() => setIsExportPdfModalOpen(false)}
        confirmLoading={isLoadingExport}
        centered
        okText={t("common.confirm")}
        destroyOnHidden
        cancelText={t("common.cancel")}
        zIndex={2000}
        bodyStyle={{ padding: "2rem 1.5rem" }}
      >
        <div className="flex flex-col items-center">
          <div className="flex items-center mb-4">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 mr-3">
              {/* Lucide Info Icon */}
              <InfoIcon className="w-5 h-5" />
            </span>
            <span className="text-base font-medium text-gray-700">
              {t("degree.exportPdfNotice", {
                coin: process.env.NEXT_PUBLIC_PDF_EXPORT_COIN || 1,
                token: "STUCOIN",
              })}
            </span>
          </div>
          {isAxiosError(errorExport) && (
            <div className="text-red-500 text-center py-2 px-4 rounded bg-red-50 w-full">
              {errorExport.response?.data?.message || t("common.errorOccurred")}
            </div>
          )}
        </div>
      </Modal>
    </Modal>
  );
}
