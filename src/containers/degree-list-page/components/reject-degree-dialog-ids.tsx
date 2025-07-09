import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";

interface RejectDegreeDialogIdsProps {
  open: boolean;
  onClose: () => void;
  onReject: () => void;
  ids: (string | number)[];
  loading?: boolean;
}

export function RejectDegreeDialogIds({
  open,
  onClose,
  onReject,
  ids,
  loading,
}: RejectDegreeDialogIdsProps) {
  const { t } = useTranslation();

  const handleOpenChange = (nextOpen: boolean) => {
    if (!loading && !nextOpen) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[420px] rounded-2xl p-0 border-0 shadow-2xl">
        <div className="flex flex-col items-center px-8 py-8">
          <div className="flex flex-col items-center gap-3 mb-4">
            <span className="text-2xl font-bold text-red-600 text-center tracking-tight">
              {t("degrees.rejectTitle") || "Từ chối văn bằng"}
            </span>
          </div>
          <div className="flex flex-col items-center gap-2 mb-6">
            <span className="text-base text-gray-600 text-center">
              {t("degrees.rejectMessage", { count: ids.length }) ||
                `Bạn có chắc chắn muốn từ chối ${ids.length} văn bằng?`}
            </span>
            <span className="text-4xl font-extrabold text-red-600 drop-shadow-sm">
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
              variant="destructive"
              onClick={onReject}
              disabled={loading}
              className="min-w-[120px] font-semibold shadow-lg rounded-lg bg-red-600 text-white hover:bg-red-700"
            >
              {loading ? (
                <Loader2 className="animate-spin w-4 h-4 mr-2" />
              ) : null}
              {t("common.reject") || "Từ chối"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
