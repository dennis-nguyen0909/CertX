import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
      <DialogContent
        className="max-w-[420px] rounded-2xl p-0 border-0 shadow-2xl bg-gradient-to-br from-white via-slate-50 to-slate-100"
        style={{ overflow: "hidden" }}
      >
        <div className="flex flex-col items-center px-8 py-8">
          <div className="flex flex-col items-center gap-3 mb-4">
            <span className="text-2xl font-bold text-gray-800 text-center tracking-tight">
              {t("degrees.confirmAction")}
            </span>
          </div>
          <div className="flex flex-col items-center gap-2 mb-6">
            <span className="text-base text-gray-600 text-center">
              {t("degrees.confirmMessage", { count: ids.length })}
            </span>
            <span className="text-4xl font-extrabold text-primary drop-shadow-sm">
              {ids.length}
            </span>
          </div>
          <div className="flex flex-row justify-center gap-4 w-full">
            <Button
              variant="ghost"
              onClick={onClose}
              disabled={loading}
              className="min-w-[100px] border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 shadow-sm rounded-lg"
            >
              {t("common.cancel")}
            </Button>
            <Button
              variant="default"
              onClick={onConfirm}
              disabled={loading}
              className="min-w-[120px] font-semibold shadow-lg rounded-lg bg-primary text-white hover:bg-primary/90"
            >
              {loading ? t("common.loading") : t("degrees.confirmAction")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
