import { Notification } from "@/models/notification";
import * as React from "react";
import { Modal, Image } from "antd";
import dayjs from "@/libs/dayjs";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@/components/ui/skeleton";
import { useNotificationDetail } from "@/hooks/notifications/use-notifications";

interface NotificationDetailDialogProps {
  open: boolean;
  onClose: () => void;
  notification: Notification | null;
}

export const NotificationDetailDialog: React.FC<
  NotificationDetailDialogProps
> = ({ open, onClose, notification }) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = React.useState(false);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "đã duyệt":
      case "approved":
        return "bg-green-100 text-green-800";
      case "chưa duyệt":
      case "pending":
        return "bg-blue-100 text-blue-800";
      case "đã từ chối":
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const {
    data: notificationDetailData,
    isLoading: isNotificationDetailLoading,
  } = useNotificationDetail({
    notificationId: notification?.id ?? 0,
    documentId: notification?.documentId ?? 0,
    documentType: notification?.documentType || "",
  });

  const itemDetail = notificationDetailData?.data;

  const renderDetailContent = () => {
    if (isNotificationDetailLoading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      );
    }

    if (!itemDetail) return null;

    return (
      <div className="space-y-6 pt-6 border-t border-gray-200">
        <h3 className="text-xl font-bold text-gray-900">
          {t("common.detailInformation") || "Detail Information"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {[
            {
              label: t("certificates.nameStudent"),
              value: itemDetail.nameStudent,
            },
            {
              label: t("certificates.studentCode"),
              value: itemDetail.studentCode,
            },
            { label: t("common.email"), value: itemDetail.email },
            {
              label: t("common.birthDate"),
              value: dayjs(itemDetail.birthDate).format("DD/MM/YYYY"),
            },
            {
              label: t("certificates.className"),
              value: itemDetail.className || itemDetail.studentClass,
            },
            {
              label: t("certificates.department"),
              value: itemDetail.department || itemDetail.departmentName,
            },
            {
              label: t("certificates.issueDate"),
              value: dayjs(itemDetail.issueDate).format("DD/MM/YYYY"),
            },
            {
              label: t("certificates.certificateName"),
              value: itemDetail.certificateName,
            },
            {
              label: t("degrees.degreeTitle"),
              value: itemDetail.degreeTitleName,
            },
            {
              label: t("certificates.diplomaNumber"),
              value: itemDetail.diplomaNumber,
            },
            {
              label: t("degrees.lotteryNumber"),
              value: itemDetail.lotteryNumber,
            },
            {
              label: t("degrees.graduationYear"),
              value: itemDetail.graduationYear,
            },
            {
              label: t("certificates.university"),
              value: itemDetail.university,
            },
            { label: t("certificates.course"), value: itemDetail.course },
            { label: t("certificates.grantor"), value: itemDetail.grantor },
            { label: t("certificates.signer"), value: itemDetail.signer },
            { label: t("degrees.rating"), value: itemDetail.ratingName },
            {
              label: t("degrees.educationMode"),
              value: itemDetail.educationModeName,
            },
            {
              label: t("degrees.trainingLocation"),
              value: itemDetail.trainingLocation,
            },
            {
              label: t("common.status"),
              value: (
                <span
                  className={`text-sm font-medium px-2.5 py-0.5 rounded-full ${getStatusColor(
                    itemDetail.status
                  )}`}
                >
                  {itemDetail.status}
                </span>
              ),
            },
          ]
            .filter((f) => f.value)
            .map((field, idx) => (
              <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs font-semibold uppercase text-gray-500 mb-1">
                  {field.label}
                </p>
                <div className="text-base text-gray-800">{field.value}</div>
              </div>
            ))}

          {(itemDetail.image_url || itemDetail.imageUrl) && (
            <div className="bg-gray-50 p-3 rounded-lg col-span-1 md:col-span-2">
              <p className="text-xs font-semibold uppercase text-gray-500 mb-1">
                {t("common.imageUrl") || "Image URL"}
              </p>
              <Image
                src={itemDetail.image_url || itemDetail.imageUrl}
                alt="Document"
                className="max-w-xs max-h-48 object-contain"
                preview
              />
            </div>
          )}

          {itemDetail.qrCodeUrl && (
            <div className="bg-gray-50 p-3 rounded-lg col-span-1 md:col-span-2">
              <p className="text-xs font-semibold uppercase text-gray-500 mb-1">
                {t("common.qrCode") || "QR Code URL"}
              </p>
              <div className="text-base break-all">
                <Image
                  src={
                    itemDetail.qrCodeUrl.startsWith("data:")
                      ? itemDetail.qrCodeUrl
                      : `data:image/png;base64,${itemDetail.qrCodeUrl}`
                  }
                  alt="QR Code"
                  width={250}
                  height={250}
                  className="mx-auto border rounded-lg"
                />
              </div>
            </div>
          )}

          {itemDetail.ipfsUrl && (
            <div className="bg-gray-50 p-3 rounded-lg col-span-1 md:col-span-2">
              <p className="text-xs font-semibold uppercase text-gray-500 mb-1">
                {t("common.ipfsUrl") || "IPFS URL"}
              </p>
              <div className="text-base break-all">{itemDetail.ipfsUrl}</div>
            </div>
          )}

          {itemDetail.transactionHash && (
            <div className="bg-gray-50 p-3 rounded-lg col-span-1 md:col-span-2">
              <p className="text-xs font-semibold uppercase text-gray-500 mb-1">
                {t("common.transactionHash") || "Transaction Hash"}
              </p>
              <div className="text-base break-all">
                {itemDetail.transactionHash}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={t("notifications.detail") || "Notification Detail"}
      width={800}
      styles={{ body: { maxHeight: "70vh", overflowY: "auto" } }}
      destroyOnHidden
      centered
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
          {/* <div>
            <p className="text-sm font-medium text-gray-500">
              {t("common.type") || "Type"}
            </p>
            <p className="text-base">{notification.type}</p>
          </div> */}
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

          {/* Toggle full detail section */}
          {isExpanded && renderDetailContent()}

          <div className="pt-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-600 text-sm font-medium hover:underline"
            >
              {isExpanded
                ? t("common.showLess") || "Show less"
                : t("common.showMore") || "Show more"}
            </button>
          </div>
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
