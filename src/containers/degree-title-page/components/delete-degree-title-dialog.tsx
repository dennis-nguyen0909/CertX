"use client";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Loader2, AlertTriangle } from "lucide-react";
import { isAxiosError } from "axios";
import { useDeleteDegreeTitle } from "@/hooks/degree/use-delete-degree-title";
import { useInvalidateByKey } from "@/hooks/use-invalidate-by-key";
import { toast } from "sonner";

interface DeleteDegreeTitleDialogProps {
  open: boolean;
  id: string;
  name: string;
}

export function DeleteDegreeTitleDialog({
  open,
  id,
  name,
}: DeleteDegreeTitleDialogProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    mutate: deleteDegreeTitle,
    isPending,
    error,
  } = useDeleteDegreeTitle();
  const invalidateDegreeTitle = useInvalidateByKey("degree-title-list");

  const handleDelete = () => {
    deleteDegreeTitle(Number.parseInt(id), {
      onSuccess: () => {
        toast.success(t("common.deleteSuccess"));
        invalidateDegreeTitle();
        router.back();
      },
    });
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        if (!isPending) {
          router.back();
        }
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            {t("common.deleteConfirmationTitle")}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            {t("common.deleteConfirmation", { itemName: name })}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {t("common.deleteConfirmationDescription", { itemName: name })}
          </p>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isPending}
            className="cursor-pointer"
          >
            {t("common.cancel")}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
            className="cursor-pointer"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("common.delete")}
          </Button>
        </DialogFooter>
        {isAxiosError(error) && (
          <p className="text-sm text-red-500">{error.response?.data.message}</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
