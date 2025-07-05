import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";

interface ConfirmCertificateDialogIdsProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  ids: (string | number)[];
  loading?: boolean;
}

export function ConfirmCertificateDialogIds({
  open,
  onClose,
  onConfirm,
  ids,
  loading,
}: ConfirmCertificateDialogIdsProps) {
  const { t } = useTranslation();

  // Ngăn đóng dialog khi loading
  const handleOpenChange = (nextOpen: boolean) => {
    if (!loading && !nextOpen) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-[420px] rounded-2xl p-0 border-0 shadow-2xl bg-gradient-to-br from-white via-slate-50 to-slate-100"
        style={{ overflow: "hidden" }}
      >
        <div className="flex flex-col items-center px-8 py-8">
          <div className="flex flex-col items-center gap-3 mb-4">
            <span className="text-2xl font-bold text-gray-800 text-center tracking-tight">
              {t("certificates.confirmTitle") || "Xác nhận chứng chỉ"}
            </span>
          </div>
          <div className="flex flex-col items-center gap-2 mb-6">
            <span className="text-base text-gray-600 text-center">
              {t("certificates.confirmMessage", { count: ids.length }) ||
                `Bạn có chắc chắn muốn xác nhận ${ids.length} chứng chỉ?`}
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
              {t("common.cancel") || "Hủy"}
            </Button>
            <Button
              variant="default"
              onClick={onConfirm}
              disabled={loading}
              className="min-w-[120px] font-semibold shadow-lg rounded-lg bg-primary text-white hover:bg-primary/90"
            >
              {loading ? (
                <Loader2 className="animate-spin w-4 h-4 mr-2" />
              ) : null}
              {t("common.confirm") || "Xác nhận"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
