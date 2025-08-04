"use client";

import { useState } from "react";
import { useNotifications } from "@/hooks/notifications/use-notifications";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslation } from "react-i18next";
import NotificationCard from "@/containers/notifications-page/components/notification-card";
import { Notification, NotificationStatus } from "@/models/notification";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { NotificationDetailDialog } from "@/containers/notifications-page/components/notification-detail-dialog";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Filter, Loader2 } from "lucide-react";
import { useMarkAllNotificationsAsRead } from "@/hooks/notifications/use-mark-all-notifications-as-read";
import {
  useAllNotifications,
  useUnreadNotifications,
} from "@/hooks/notifications/use-notifications";
import { useGuardRoute } from "@/hooks/use-guard-route";

export default function NotificationPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<NotificationStatus>("all");
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const pageSize = 20;
  useGuardRoute();

  const { data, isLoading } = useNotifications({
    page,
    size: pageSize,
    status: status === "all" ? null : status,
  });
  const notifications = data?.items || [];
  const meta = data?.meta;

  const { data: allNotificationsMeta } = useAllNotifications({ size: 1 });
  const { data: unreadNotificationsMeta } = useUnreadNotifications({ size: 1 });

  const unreadCount = unreadNotificationsMeta?.meta?.total || 0;
  const allCount = allNotificationsMeta?.meta?.total || 0;
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);

  const handleNotificationClick = (notification: Notification) => {
    setSelectedNotification(notification);
    setOpenDetailDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDetailDialog(false);
    setSelectedNotification(null);
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
    queryClient.invalidateQueries({ queryKey: ["unreadNotificationsMeta"] });
    queryClient.invalidateQueries({ queryKey: ["allNotificationsMeta"] });

    router.push(window.location.pathname, { scroll: false });
  };

  const { mutate: markAllAsRead } = useMarkAllNotificationsAsRead();

  const handleMarkAllAsRead = () => {
    markAllAsRead(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
        queryClient.invalidateQueries({ queryKey: ["allNotificationsMeta"] });
        queryClient.invalidateQueries({
          queryKey: ["unreadNotificationsMeta"],
        });
      },
    });
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-80px)] overflow-hidden bg-gray-50">
      {/* Mobile filter button */}
      <div className="flex md:hidden items-center justify-between px-4 py-3 border-b bg-white sticky top-0 z-20">
        <h2 className="text-lg font-semibold">
          {t("nav.notifications") || "Notifications"}
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowMobileFilter((prev) => !prev)}
          aria-label={t("common.filter") || "Filter"}
        >
          <Filter className="w-5 h-5" />
        </Button>
      </div>
      {/* Mobile filter drawer/modal */}
      {showMobileFilter && (
        <div
          className="fixed inset-0 z-30 bg-black/40 flex md:hidden"
          onClick={() => setShowMobileFilter(false)}
        >
          <div
            className="bg-white w-64 h-full p-4 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4">
              {t("nav.notifications") || "Notifications"}
            </h2>
            <div className="flex flex-col gap-2">
              <Button
                variant={status === "all" ? "default" : "outline"}
                className="justify-start"
                onClick={() => {
                  setStatus("all");
                  setShowMobileFilter(false);
                }}
              >
                {t("common.all") || "All"} ({allCount})
              </Button>
              <Button
                variant={status === "unread" ? "default" : "outline"}
                className="justify-start"
                onClick={() => {
                  setStatus("unread");
                  setShowMobileFilter(false);
                }}
              >
                {t("common.unread") || "Unread"} ({unreadCount})
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Left sidebar for filters (desktop) */}
      <div className="hidden md:flex flex-col w-64 border-r bg-white p-4">
        <h2 className="text-lg font-semibold mb-4">
          {t("nav.notifications") || "Notifications"}
        </h2>
        <div className="flex flex-col gap-2">
          <Button
            variant={status === "all" ? "default" : "outline"}
            className="justify-start"
            onClick={() => setStatus("all")}
          >
            {t("common.all") || "All"} ({allCount})
          </Button>
          <Button
            variant={status === "unread" ? "default" : "outline"}
            className="justify-start"
            onClick={() => setStatus("unread")}
          >
            {t("common.unread") || "Unread"} ({unreadCount})
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Card className="p-0 overflow-hidden flex-1 flex flex-col bg-white rounded-none border-none">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-4 sm:px-6 py-4 border-b bg-white sticky top-0 z-10">
            <div className="flex items-center w-full sm:w-auto justify-between sm:justify-start">
              <Button
                variant="outline"
                onClick={handleMarkAllAsRead}
                disabled={unreadCount === 0}
                className="w-full sm:w-auto"
              >
                {t("notification.markAllRead")}
              </Button>
            </div>
            <div
              className={
                meta && meta.total_pages > 0 ? "w-full sm:w-auto" : "invisible"
              }
            >
              <div className="bg-white pt-4 pb-2 flex justify-end items-center gap-4 pr-0 sm:pr-4">
                <span className="text-sm text-gray-700 whitespace-nowrap">
                  {t("pagination.range", {
                    start: (page - 1) * pageSize + 1,
                    end: Math.min(page * pageSize, meta?.total || 0),
                    total: meta?.total || 0,
                  }) ||
                    `${(page - 1) * pageSize + 1}-${Math.min(
                      page * pageSize,
                      meta?.total || 0
                    )} trong số ${meta?.total || 0}`}
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setPage((prev) => prev - 1)}
                    disabled={page === 1}
                    className="h-8 w-8"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setPage((prev) => prev + 1)}
                    disabled={page === (meta?.total_pages || 0)}
                    className="h-8 w-8"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div>
              {isLoading ? (
                <div className="flex justify-center items-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="px-6 py-8 text-center text-muted-foreground">
                  {t("common.noData")}
                </div>
              ) : (
                notifications.map((n) => {
                  return (
                    <NotificationCard
                      key={n.id}
                      notification={n}
                      onClick={() => handleNotificationClick(n)}
                    />
                  );
                })
              )}
            </div>
          </ScrollArea>
        </Card>
      </div>
      <NotificationDetailDialog
        open={openDetailDialog}
        onClose={handleCloseDialog}
        notification={selectedNotification}
      />
    </div>
  );
}
