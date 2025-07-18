"use client";

import { useState } from "react";
import { useNotifications } from "@/hooks/notifications/use-notifications";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
// import { Checkbox } from "@/components/ui/checkbox";
import { useTranslation } from "react-i18next";
import NotificationCard from "@/containers/notifications-page/components/notification-card";
import { Notification, NotificationStatus } from "@/models/notification";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { NotificationDetailDialog } from "@/containers/notifications-page/components/notification-detail-dialog";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMarkAllNotificationsAsRead } from "@/hooks/notifications/use-mark-all-notifications-as-read";
import {
  useAllNotifications,
  useUnreadNotifications,
} from "@/hooks/notifications/use-notifications";

export default function NotificationPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<NotificationStatus>("all");
  const pageSize = 20;
  // const [search, setSearch] = useState<string>("");
  // const debouncedSearch = useDebounce(search, 500);

  const { data } = useNotifications({
    page,
    size: pageSize,
    status: status === "all" ? null : status,
    // search: debouncedSearch,
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
    <div className="flex h-[calc(100vh-80px)] overflow-hidden bg-gray-50">
      {/* Left sidebar for filters */}
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
          <div className="flex items-center  justify-between px-6 py-4 border-b bg-white sticky top-0 z-10">
            <div className="flex items-center">
              <Button
                variant="outline"
                onClick={handleMarkAllAsRead}
                disabled={unreadCount === 0}
              >
                {t("notification.markAllRead")}
              </Button>
            </div>
            <div className={meta && meta.total_pages > 0 ? "" : "invisible"}>
              <div className="bg-white pt-4 pb-2 flex justify-end pr-4 items-center gap-4">
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
              {/* Removed Skeleton loading state */}
              {notifications.length === 0 ? (
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
