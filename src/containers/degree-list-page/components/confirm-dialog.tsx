import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Degree } from "@/models/degree";
import { useDegreeValidation } from "@/hooks/degree/use-degree-validation";
import { isAxiosError } from "axios";
import { useInvalidateByKey } from "@/hooks/use-invalidate-by-key";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  degree: Degree;
  title?: string;
  description?: string;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onClose,
  degree,
  title,
  description,
}) => {
  const { t } = useTranslation();
  const confirmMutation = useDegreeValidation();
  const queryClient = useInvalidateByKey("degree");

  const handleConfirm = () => {
    confirmMutation.mutate(degree.id, {
      onSuccess: () => {
        onClose();
        queryClient();
      },
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!confirmMutation.isPending && !nextOpen) {
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{title || t("common.confirm")}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          {description || t("degrees.confirmActionDescription")}
        </p>
        {isAxiosError(confirmMutation.error) && (
          <div className="text-red-500 text-sm mt-2 w-full text-left">
            {confirmMutation.error.response?.data.message}
          </div>
        )}
        <DialogFooter>
          <Button onClick={handleConfirm} disabled={confirmMutation.isPending}>
            {confirmMutation.isPending
              ? t("common.loading")
              : t("degrees.confirmAction")}
          </Button>
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={confirmMutation.isPending}
          >
            {t("common.cancel")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
