import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
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
      <DialogContent>
        <DialogHeader>
          {t("certificates.confirmTitle") || "Xác nhận chứng chỉ"}
        </DialogHeader>
        <div>
          {t("certificates.confirmMessage", { count: ids.length }) ||
            `Bạn có chắc chắn muốn xác nhận ${ids.length} chứng chỉ?`}
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            {t("common.cancel") || "Hủy"}
          </Button>
          <Button variant="default" onClick={onConfirm} disabled={loading}>
            {loading ? (
              <Loader2 className="animate-spin w-4 h-4" />
            ) : (
              t("common.confirm") || "Xác nhận"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
