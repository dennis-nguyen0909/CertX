"use client";
import React from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Degree } from "@/models/degree";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
    {isLink ? value : <p className="text-base break-words">{value || "---"}</p>}
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
              unoptimized
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
              value={degree.departmentName || degree.department}
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
                <Badge
                  variant={
                    degree.status?.toLowerCase() === "active" ||
                    degree.status?.toLowerCase() === "verified"
                      ? "default"
                      : degree.status?.toLowerCase() === "inactive"
                      ? "destructive"
                      : degree.status?.toLowerCase() === "pending"
                      ? "secondary"
                      : "outline"
                  }
                  className={
                    degree.status?.toLowerCase() === "active" ||
                    degree.status?.toLowerCase() === "verified"
                      ? "bg-green-100 text-green-800 border-green-200"
                      : degree.status?.toLowerCase() === "pending"
                      ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                      : ""
                  }
                >
                  {t(`common.statusText.${degree.status?.toLowerCase()}`) ||
                    t("common.unknown")}
                </Badge>
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
              value={degree.transactionHash}
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
                    className="text-blue-600 hover:text-blue-800 underline break-all"
                  >
                    {degree.ipfsUrl}
                  </a>
                ) : (
                  "---"
                )
              }
            />
            <div className="col-span-1">
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
                  unoptimized
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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("degrees.viewDetail")}</DialogTitle>
        </DialogHeader>
        {renderContent()}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("common.close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
