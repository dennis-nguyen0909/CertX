import { Notification } from "@/models/notification";
import * as React from "react";
import { Modal } from "antd";
import dayjs from "@/libs/dayjs";
import { useTranslation } from "react-i18next";
import { useDegreeDetail } from "@/hooks/degree/use-degree-detail"; // Added import
import { useCertificatesDetail } from "@/hooks/certificates/use-certificates-detail"; // Added import
import { Skeleton } from "@/components/ui/skeleton"; // Added for loading state

interface NotificationDetailDialogProps {
  open: boolean;
  onClose: () => void;
  notification: Notification | null;
}

export const NotificationDetailDialog: React.FC<
  NotificationDetailDialogProps
> = ({ open, onClose, notification }) => {
  const { t } = useTranslation();

  const isDegreeNotification =
    notification &&
    ["DEGREE_CREATED", "DEGREE_APPROVED", "DEGREE_REJECTED"].includes(
      notification.type
    );
  const isCertificateNotification =
    notification &&
    ["CERTIFICATE_CREATED", "CERTIFICATE_REJECTED"].includes(notification.type);

  const degreeId = isDegreeNotification ? notification.id : undefined;
  const certificateId = isCertificateNotification ? notification.id : undefined;

  const { data: degreeDetail, isLoading: isDegreeLoading } =
    useDegreeDetail(degreeId);
  const { data: certificateDetail, isLoading: isCertificateLoading } =
    useCertificatesDetail(certificateId, {
      enabled: !!certificateId,
    });

  const renderDetailContent = () => {
    if (isDegreeLoading || isCertificateLoading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      );
    }

    if (isDegreeNotification && degreeDetail) {
      return (
        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-lg font-semibold text-gray-800">
            {t("degrees.detailInformation") || "Degree Detail Information"}
          </h3>
          <div>
            <p className="text-sm font-medium text-gray-500">
              {t("degrees.nameStudent") || "Student Name"}
            </p>
            <p className="text-base">{degreeDetail.nameStudent}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">
              {t("degrees.diplomaNumber") || "Diploma Number"}
            </p>
            <p className="text-base">{degreeDetail.diplomaNumber}</p>
          </div>
          {/* Add more degree details as needed */}
        </div>
      );
    }

    if (isCertificateNotification && certificateDetail) {
      return (
        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-lg font-semibold text-gray-800">
            {t("certificates.detailInformation") ||
              "Certificate Detail Information"}
          </h3>
          <div>
            <p className="text-sm font-medium text-gray-500">
              {t("certificates.nameStudent") || "Student Name"}
            </p>
            <p className="text-base">{certificateDetail.nameStudent}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">
              {t("certificates.diplomaNumber") || "Diploma Number"}
            </p>
            <p className="text-base">{certificateDetail.diplomaNumber}</p>
          </div>
          {/* Add more certificate details as needed */}
        </div>
      );
    }

    return null;
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={t("notifications.detail") || "Notification Detail"}
      width={600}
      styles={{ body: { maxHeight: "70vh", overflowY: "auto" } }}
      destroyOnHidden
    >
      {notification ? (
        <div className="space-y-4 py-4">
          <div>
            <p className="text-sm font-medium text-gray-500">
              {t("common.title") || "Title"}
            </p>
            <p className="text-base font-semibold">{notification.title}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">
              {t("common.content") || "Content"}
            </p>
            <p className="text-base text-gray-700">{notification.content}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">
              {t("common.type") || "Type"}
            </p>
            <p className="text-base">{notification.type}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">
              {t("common.createdAt") || "Created At"}
            </p>
            <p className="text-base">
              {dayjs(notification.createdAt).format("DD/MM/YYYY HH:mm")}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">
              {t("common.status") || "Status"}
            </p>
            <p className="text-base">
              {notification.read ? (
                <span className="text-gray-500">
                  {t("common.read") || "Read"}
                </span>
              ) : (
                <span className="text-blue-500 font-medium">
                  {t("common.unread") || "Unread"}
                </span>
              )}
            </p>
          </div>
          {renderDetailContent()}
          {/* Render conditional detail content */}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">
          {t("common.noData") || "No notification data available."}
        </p>
      )}
      <div className="flex justify-end pt-4 border-t mt-6">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-100"
        >
          {t("common.close") || "Close"}
        </button>
      </div>
    </Modal>
  );
};
