import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

interface RejectCertificateDialogIdsProps {
  open: boolean;
  onClose: () => void;
  onReject: (note: string) => void;
  ids: (string | number)[];
  loading?: boolean;
}

export function RejectCertificateDialogIds({
  open,
  onClose,
  onReject,
  ids,
  loading,
}: RejectCertificateDialogIdsProps) {
  const { t } = useTranslation();
  const [note, setNote] = useState("");

  // Ngăn đóng dialog khi loading
  const handleOpenChange = (nextOpen: boolean) => {
    if (!loading && !nextOpen) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[420px] rounded-2xl p-0 border-0 shadow-2xl ">
        <div className="flex flex-col items-center px-8 py-8">
          <div className="flex flex-col items-center gap-3 mb-4">
            <span className="text-2xl font-bold text-red-600 text-center tracking-tight">
              {t("certificates.rejectTitle") || "Từ chối chứng chỉ"}
            </span>
          </div>
          <div className="flex flex-col items-center gap-2 mb-6">
            <span className="text-base text-gray-600 text-center">
              {t("certificates.rejectMessage", { count: ids.length }) ||
                `Bạn có chắc chắn muốn từ chối ${ids.length} chứng chỉ?`}
            </span>
            <span className="text-4xl font-extrabold text-red-600 drop-shadow-sm">
              {ids.length}
            </span>
          </div>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"></DialogTitle>
          </DialogHeader>
          <div className="py-2 space-y-3 w-full">
            <label
              htmlFor="reject-note"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("common.rejectNoteLabel")}
              <span className="ml-1 text-red-500 font-normal">
                ({t("common.requireShort")})
              </span>
            </label>
            <Textarea
              id="reject-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t("common.rejectNotePlaceholder")}
              rows={4}
              className="w-full"
              disabled={loading}
              required
            />
          </div>
          <DialogFooter>
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
              onClick={() => onReject(note)}
              disabled={loading || !note.trim()}
              className="min-w-[120px] font-semibold shadow-lg rounded-lg bg-rose-600 text-white hover:bg-rose-700"
            >
              {loading ? (
                <Loader2 className="animate-spin w-4 h-4 mr-2" />
              ) : null}
              {t("common.reject") || "Từ chối"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
