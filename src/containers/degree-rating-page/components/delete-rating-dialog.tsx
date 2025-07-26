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
import { useDeleteRating } from "@/hooks/rating/use-delete-rating";
import { useInvalidateByKey } from "@/hooks/use-invalidate-by-key";

interface DeleteDialogProps {
  open: boolean;
  id: string;
  name: string;
}

export function DeleteRatingDialog({ open, id, name }: DeleteDialogProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { mutate: deleteCertificateType, isPending, error } = useDeleteRating();
  const queryClient = useInvalidateByKey("rating");
  const handleDelete = () => {
    deleteCertificateType(Number.parseInt(id), {
      onSuccess: () => {
        queryClient();
        router.back();
      },
      onError: (error) => {
        console.error("Error deleting certificate type:", error);
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
      <DialogContent className="sm:max-w-[425px]">
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
          <p className="text-red-500 text-sm mt-2">
            {isAxiosError(error) && error.response?.data?.message}
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
      </DialogContent>
    </Dialog>
  );
}
