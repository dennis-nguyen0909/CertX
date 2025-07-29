"use client";
import React from "react";
import { Image, Modal } from "antd";
import { Degree } from "@/models/degree";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { usePaymentForExportPdf } from "@/hooks/student/use-payment-for-export-pdf";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";
import { useState } from "react";
import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";

interface ViewDialogProps {
  open: boolean;
  onClose: () => void;
  degree: Degree | null;
  loading: boolean;
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

export const ViewDialog: React.FC<ViewDialogProps> = ({
  open,
  onClose,
  degree,
  loading,
}) => {
  const { t } = useTranslation();
  const role = useSelector((state: RootState) => state.user.role);
  const [isExportPdfModalOpen, setIsExportPdfModalOpen] = useState(false);
  const {
    mutate: mutateStudent,
    isPending: isLoadingExport,
    error: errorExport,
  } = usePaymentForExportPdf();
  const router = useRouter();

  const formatDate = (dateString?: string) => {
    if (!dateString) return "---";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "---";
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const exportPDF = async () => {
    if (!degree?.studentId) {
      console.error("Missing studentId for export PDF");
      return;
    }

    mutateStudent(undefined, {
      onSuccess: async () => {
        const input = document.getElementById("degree-pdf-content");
        if (!input) return;

        try {
          const padding = 24;
          const originalRect = input.getBoundingClientRect();
          const paddedWidth = originalRect.width + padding * 2;
          const paddedHeight = originalRect.height + padding * 2;

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
              const elementsToRemove =
                documentClone.querySelectorAll(".remove-on-pdf");
              elementsToRemove.forEach((el) => el.remove());
            },
            width: paddedWidth,
            height: paddedHeight,
          });

          document.body.removeChild(wrapper);

          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF("p", "pt", "a4");
          const imgWidth = 595.28;
          const pageHeight = 841.89;
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
          setIsExportPdfModalOpen(false);
        } catch (error) {
          console.error("Lỗi export PDF:", error);
        }
      },
      onError: (error: unknown) => {
        console.error("Lỗi khi thanh toán và xuất PDF:", error);
      },
    });
  };

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const renderContent = () => {
    if (loading || !degree) {
      return (
        <div className="space-y-6">
          <Skeleton className="w-full h-80 rounded-lg" />
          {/* Student Info */}
          <div>
            <Skeleton className="h-6 w-1/3 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          {/* Degree Info */}
          <div>
            <Skeleton className="h-6 w-1/3 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6" id="degree-pdf-content">
        {/* Degree Image */}
        {degree.imageUrl && (
          <div className="flex justify-center">
            <Image
              src={degree.imageUrl}
              alt="Degree Image"
              className="max-w-full h-auto border rounded-lg shadow-lg"
              width={600}
              height={400}
              preview={{ zIndex: 1050, getContainer: () => document.body }}
            />
          </div>
        )}

        {/* Student Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
            {t("degrees.studentInformation")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailRow
              label={t("degrees.nameStudent")}
              value={degree.nameStudent}
            />
            <DetailRow
              label={t("degrees.studentCode")}
              value={degree.studentCode}
            />
            <DetailRow
              label={t("degrees.birthDate")}
              value={formatDate(degree.birthDate)}
            />
            <DetailRow label={t("common.email")} value={degree.email} />
            <DetailRow
              label={t("degrees.className")}
              value={degree.className}
            />
            <DetailRow
              label={t("degrees.department")}
              value={degree.departmentName}
            />
            <DetailRow label={t("degrees.course")} value={degree.course} />
            <DetailRow
              label={t("degrees.graduationYear")}
              value={degree.graduationYear}
            />
          </div>
        </div>

        {/* Degree Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
            {t("degrees.degreeInformation")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailRow
              label={t("degrees.university")}
              value={degree.university}
            />
            <DetailRow label={t("degrees.signerInfo")} value={degree.signer} />
            <DetailRow
              label={t("degrees.diplomaNumber")}
              value={degree.diplomaNumber}
            />
            <DetailRow
              label={t("degrees.lotteryNumber")}
              value={degree.lotteryNumber}
            />
            <DetailRow
              label={t("degrees.issueDate")}
              value={formatDate(degree.issueDate)}
            />
            <DetailRow
              label={t("degrees.status")}
              value={
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                    degree.status
                  )}`}
                >
                  {t(`common.statusText.${degree.status?.toLowerCase()}`) ||
                    t("common.unknown")}
                </span>
              }
            />
            <DetailRow
              label={t("common.createdAt")}
              value={formatDateTime(degree.createdAt)}
            />
            {degree.rejectedNote && (
              <DetailRow
                label={t("common.rejectNoteLabel")}
                value={
                  <div className=" text-red-700">{degree.rejectedNote}</div>
                }
              />
            )}
          </div>
        </div>

        {/* Blockchain Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
            {t("degrees.blockchainInformation")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailRow
              label={t("degrees.transactionHash")}
              value={
                degree.transactionHash ? (
                  <span className="break-all whitespace-break-spaces">
                    {degree.transactionHash}
                  </span>
                ) : (
                  "---"
                )
              }
            />
            <DetailRow
              label={t("degrees.ipfsUrl")}
              isLink
              value={
                degree.ipfsUrl ? (
                  <a
                    href={degree.ipfsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline break-all whitespace-break-spaces"
                  >
                    {degree.ipfsUrl}
                  </a>
                ) : (
                  "---"
                )
              }
            />
            <div className="col-span-1 flex flex-col">
              <label className="text-sm font-medium text-gray-500">
                {t("degrees.qrCode")}
              </label>
              {degree.qrCodeUrl ? (
                <Image
                  src={
                    degree.qrCodeUrl.startsWith("data:")
                      ? degree.qrCodeUrl
                      : `data:image/png;base64,${degree.qrCodeUrl}`
                  }
                  alt="QR Code"
                  width={150}
                  height={150}
                  preview={{ zIndex: 1050, getContainer: () => document.body }}
                />
              ) : (
                <p>---</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={t("degrees.viewDetail")}
      width={1000}
      styles={{ body: { maxHeight: "80vh", overflowY: "auto" } }}
      destroyOnHidden
    >
      {renderContent()}
      <div className="flex justify-end pt-4 border-t mt-6">
        <Button variant="outline" onClick={onClose}>
          {t("common.close")}
        </Button>
        {degree?.ipfsUrl && (
          <Button
            onClick={() => {
              let ipfsToUse = degree.ipfsUrl;
              try {
                if (degree.ipfsUrl) {
                  const url = new URL(degree.ipfsUrl);
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
                ipfsToUse = degree.ipfsUrl; // Fallback to full URL
              }
              // Ensure router is imported if not already
              // import { useRouter } from "next/navigation";
              // const router = useRouter();
              router.push(`/verification?ipfsUrl=${ipfsToUse}&type=degree`);
            }}
            className="ml-2"
          >
            Xác minh chứng chỉ
          </Button>
        )}
        {role === "STUDENT" && (
          <Button
            onClick={() => setIsExportPdfModalOpen(true)}
            className="ml-2"
          >
            Xuất PDF
          </Button>
        )}
      </div>

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
};
