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
import { useClassDelete } from "@/hooks/class/use-class-delete";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, AlertTriangle } from "lucide-react";
import { isAxiosError } from "axios";
import { toast } from "sonner";

interface DeleteDialogProps {
  open: boolean;
  id: string;
  className: string;
}

export function DeleteDialog({ open, id, className }: DeleteDialogProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: deleteClass, isPending, error } = useClassDelete();

  const handleDelete = () => {
    deleteClass(id, {
      onSuccess: () => {
        // Invalidate and refetch the class list
        toast.success(t("common.deleteSuccess"));
        queryClient.invalidateQueries({ queryKey: ["class-list"] });
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            {t("common.deleteConfirmationTitle")}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            {t("common.deleteConfirmation", { itemName: className })}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {t("common.deleteConfirmationDescription", { itemName: className })}
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
