"use client";
import React from "react";
import { Image, Modal } from "antd";
import { Degree } from "@/models/degree";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

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
      <div className="space-y-6">
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
      bodyStyle={{ maxHeight: "80vh", overflowY: "auto" }}
      destroyOnClose
    >
      {renderContent()}
      <div className="flex justify-end pt-4 border-t mt-6">
        <Button variant="outline" onClick={onClose}>
          {t("common.close")}
        </Button>
      </div>
    </Modal>
  );
};
