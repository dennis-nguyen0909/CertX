"use client";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { usePaginationQuery } from "@/hooks/use-pagination-query";
import { useEffect, useState } from "react";
import { useUniversityList } from "@/hooks/university/use-university-list";
import { useGuardRoute } from "@/hooks/use-guard-route";
import { useUniversityColumns } from "./use-columns";
import { useRouter, useSearchParams } from "next/navigation";
import ViewDialog from "./components/view-dialog";
import { useUniversityUnlock } from "@/hooks/university/use-university-unlock";
import { toast } from "@/components/ui/use-toast";
import { useInvalidateByKey } from "@/hooks/use-invalidate-by-key";
import ConfirmationDialog from "@/components/confirmation-dialog";

export default function UniversityListPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState<string>("");
  const { setPagination, pageIndex, pageSize } = usePaginationQuery();
  const [debouncedSearch, setDebouncedSearch] = useState<string>(search);
  const router = useRouter();
  const searchParams = useSearchParams();
  useGuardRoute();
  const reloadKey = useInvalidateByKey("university");

  const unlockMutation = useUniversityUnlock();
  const [lockDialog, setLockDialog] = useState<{
    open: boolean;
    id?: number;
    name?: string;
    locked?: boolean;
  }>({ open: false });

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const {
    data: listData,
    isLoading: isLoadingListData,
    error,
    isError,
  } = useUniversityList({
    page: pageIndex + 1,
    size: pageSize,
    nameUniversity: debouncedSearch,
  });

  // Xử lý mở dialog view detail qua URL params
  const handleViewDetail = (id: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set("action", "view");
    params.set("id", id);
    router.replace(`?${params.toString()}`);
  };
  const handleCloseDialog = () => {
    const params = new URLSearchParams(window.location.search);
    params.delete("action");
    params.delete("id");
    router.replace(`?${params.toString()}`);
  };
  const openViewDialog =
    searchParams.get("action") === "view" && searchParams.get("id");

  const handleUnlock = (id: number, name?: string, locked?: boolean) => {
    setLockDialog({ open: true, id, name, locked });
  };

  const handleConfirmLock = () => {
    if (!lockDialog.id) return;
    unlockMutation.mutate(lockDialog.id, {
      onSuccess: () => {
        toast({ title: t("university.unlockSuccess", "Mở khóa thành công") });
        reloadKey();
        setLockDialog({ open: false });
      },
      onError: () => {
        toast({
          title: t("university.unlockError", "Mở khóa thất bại"),
          variant: "destructive",
        });
      },
    });
  };

  const handleViewDepartments = (id: number) => {
    router.push(`/department-university-list?universityId=${id}`);
  };

  const columns = useUniversityColumns(
    (key: string, defaultText?: string) =>
      defaultText ? t(key, { defaultValue: defaultText }) : t(key),
    handleViewDetail,
    (id: number, name?: string, locked?: boolean) =>
      handleUnlock(id, name, locked),
    handleViewDepartments
  );

  // Handle error state
  if (isError) {
    console.error("Error loading universities:", error);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center ">
        <h1 className="text-2xl font-bold">
          {t("university.management", "Quản lý trường đại học")}
        </h1>
        {/* <Button>{t("university.create", "Thêm trường mới")}</Button> */}
      </div>
      <div className="flex flex-row gap-4">
        <div className="relative w-1/4">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("common.searching", "Tìm kiếm")}
            className="pl-8"
          />
        </div>
      </div>
      <DataTable
        columns={columns}
        data={listData?.items || []}
        onPaginationChange={setPagination}
        listMeta={listData?.meta}
        containerClassName="flex-1"
        isLoading={isLoadingListData && !isError}
      />
      <ViewDialog
        open={!!openViewDialog}
        id={openViewDialog ? Number(searchParams.get("id")) : undefined}
        onClose={handleCloseDialog}
      />
      <ConfirmationDialog
        open={lockDialog.open}
        onOpenChange={(open) => setLockDialog((prev) => ({ ...prev, open }))}
        onConfirm={handleConfirmLock}
        loading={unlockMutation.isPending}
        title={
          lockDialog.locked
            ? t("university.unlockTitle", "Mở khóa tài khoản trường")
            : t("university.lockTitle", "Khóa tài khoản trường")
        }
        description={
          lockDialog.locked
            ? t("university.unlockConfirmation", {
                name: lockDialog.name || "",
              })
            : t("university.lockConfirmation", { name: lockDialog.name || "" })
        }
        confirmText={
          lockDialog.locked
            ? t("university.unlock", "Mở khóa")
            : t("university.lock", "Khóa")
        }
        cancelText={t("common.cancel", "Hủy")}
      />
      {/* Dialog tạo/sửa trường đại học sẽ đặt ở đây nếu cần */}
    </div>
  );
}
