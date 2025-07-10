"use client";

import { useState } from "react";
import { useNotifications } from "@/hooks/notifications/use-notifications";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import SimplePagination from "@/components/ui/simple-pagination";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslation } from "react-i18next";
import NotificationCard from "@/containers/notifications-page/components/notification-card";
import { NotificationStatus } from "@/models/notification";
import { Button } from "@/components/ui/button";

export default function NotificationPage() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<NotificationStatus>("all");
  const [pageSize, setPageSize] = useState(20);
  const { data, isLoading } = useNotifications({
    page,
    size: pageSize,
    status: status === "all" ? null : status,
  });
  const notifications = data?.items || [];
  const meta = data?.meta;

  // Checkbox state
  const [selected, setSelected] = useState<number[]>([]);
  const allChecked =
    notifications.length > 0 && selected.length === notifications.length;
  const isIndeterminate =
    selected.length > 0 && selected.length < notifications.length;

  const handleSelectAll = () => {
    if (allChecked) setSelected([]);
    else setSelected(notifications.map((_, idx) => idx));
  };
  const handleSelect = (idx: number) => {
    setSelected((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-6">{t("nav.notifications")}</h1>
      {/* Status filter */}
      <div className="flex items-center gap-2 mb-4">
        <Button
          variant={status === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setStatus("all")}
        >
          {t("common.all") || "All"}
        </Button>
        <Button
          variant={status === "unread" ? "default" : "outline"}
          size="sm"
          onClick={() => setStatus("unread")}
        >
          {t("common.unread") || "Unread"}
        </Button>
      </div>
      <Card className="p-0">
        {/* Select all checkbox */}
        <div className="flex items-center px-6 py-3 border-b bg-muted/50 sticky top-0 z-10">
          <Checkbox
            checked={allChecked}
            indeterminate={isIndeterminate}
            onCheckedChange={handleSelectAll}
            className="mr-3"
            aria-label="Select all notifications"
          />
          <span className="text-sm font-medium text-muted-foreground select-none">
            {t("common.selectAll")}
          </span>
        </div>
        <div className="hidden md:block">
          {/* Desktop: không giới hạn chiều cao */}
          <div>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div className="px-6 py-4" key={i}>
                  <Skeleton className="h-5 w-1/3 mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-1" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              ))
            ) : notifications.length === 0 ? (
              <div className="px-6 py-8 text-center text-muted-foreground">
                {t("common.noData")}
              </div>
            ) : (
              notifications.map((n, idx) => {
                const isChecked = selected.includes(idx);
                return (
                  <NotificationCard
                    key={idx}
                    notification={n}
                    checked={isChecked}
                    onCheckedChange={() => handleSelect(idx)}
                    index={idx}
                  />
                );
              })
            )}
          </div>
        </div>
        <div className="block md:hidden">
          {/* Mobile: giữ ScrollArea nếu muốn */}
          <ScrollArea className="max-h-[70vh] min-h-[300px]">
            <div>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div className="px-6 py-4" key={i}>
                    <Skeleton className="h-5 w-1/3 mb-2" />
                    <Skeleton className="h-4 w-2/3 mb-1" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                ))
              ) : notifications.length === 0 ? (
                <div className="px-6 py-8 text-center text-muted-foreground">
                  {t("common.noData")}
                </div>
              ) : (
                notifications.map((n, idx) => {
                  const isChecked = selected.includes(idx);
                  return (
                    <NotificationCard
                      key={idx}
                      notification={n}
                      checked={isChecked}
                      onCheckedChange={() => handleSelect(idx)}
                      index={idx}
                    />
                  );
                })
              )}
            </div>
          </ScrollArea>
        </div>
        {meta && meta.total_pages > 1 && (
          <div className="border-t mt-2 pt-4 pb-2 flex justify-center bg-white">
            <SimplePagination
              pageIndex={meta.current_page - 1}
              pageCount={meta.total_pages}
              onPageChange={(idx) => setPage(idx + 1)}
              pageSize={pageSize}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setPage(1); // reset to first page when page size changes
              }}
              pageSizeOptions={[10, 20, 30, 50, 100]}
            />
          </div>
        )}
      </Card>
    </div>
  );
}
