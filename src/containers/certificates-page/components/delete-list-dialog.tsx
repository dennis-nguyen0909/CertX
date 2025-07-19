import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Loader2, AlertTriangle } from "lucide-react";
import { useDeleteCertificateList } from "@/hooks/certificates/use-delete-certificate-list";
import { useInvalidateByKey } from "@/hooks/use-invalidate-by-key";
import { isAxiosError } from "axios";
import { useEffect } from "react";

interface DeleteCertificateListDialogProps {
  open: boolean;
  onClose: () => void;
  ids: (string | number)[];
}

export function DeleteCertificateListDialog({
  open,
  onClose,
  ids,
}: DeleteCertificateListDialogProps) {
  const { t } = useTranslation();
  const queryClient = useInvalidateByKey("certificate");

  const {
    mutate: deleteCertificateList,
    isPending,
    error,
    reset,
  } = useDeleteCertificateList();

  // Clear error when dialog is closed
  useEffect(() => {
    if (!open) {
      reset?.();
    }
  }, [open, reset]);

  const handleDelete = () => {
    deleteCertificateList(ids.map(Number), {
      onSuccess: () => {
        queryClient();
        onClose();
        reset?.(); // Clear error after successful delete and close
      },
      onError: (error) => {
        console.error("Error deleting certificate list:", error);
      },
    });
  };

  const handleClose = () => {
    onClose();
    reset?.();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            {t("common.deleteConfirmationTitle")}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            {t("certificates.deleteListConfirmation", { count: ids.length })}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {t("common.deleteConfirmationDescription", {
              itemName: `Các chứng chỉ này`,
            })}
          </p>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
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
          <p className="text-red-500 text-sm text-center">
            {error.response?.data.message}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
