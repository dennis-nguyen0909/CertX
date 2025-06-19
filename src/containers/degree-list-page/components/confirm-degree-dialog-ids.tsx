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

interface ConfirmDegreeDialogIdsProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  ids: number[];
  loading?: boolean;
}

export const ConfirmDegreeDialogIds: React.FC<ConfirmDegreeDialogIdsProps> = ({
  open,
  onClose,
  onConfirm,
  ids,
  loading,
}) => {
  const { t } = useTranslation();
  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!loading && !nextOpen) {
          onClose();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("degrees.confirmAction")}</DialogTitle>
        </DialogHeader>
        <div>{t("degrees.confirmMessage", { count: ids.length })}</div>
        <DialogFooter>
          <Button onClick={onConfirm} disabled={loading}>
            {loading ? t("common.loading") : t("degrees.confirmAction")}
          </Button>
          <Button variant="ghost" onClick={onClose}>
            {t("common.cancel")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
