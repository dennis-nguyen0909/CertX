import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Loader2, AlertCircle } from "lucide-react";
import { useExportDegrees } from "@/hooks/degree/use-degrees-export";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";

interface ExportDialogProps {
  typeTab: string;
}

export function ExportDialog({ typeTab }: ExportDialogProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { mutate, isPending, error } = useExportDegrees();
  const [fileInfo, setFileInfo] = useState<{
    fileName: string;
    blob: Blob;
  } | null>(null);
  const [type, setType] = useState<string>(typeTab);

  useEffect(() => {
    setType(typeTab);
  }, [typeTab]);

  console.log("typeTabtypeTab", typeTab);

  const handleExport = () => {
    mutate(type === "all" ? null : type, {
      onSuccess: (response: { fileName: string; blob: Blob }) => {
        // Đặt lại fileName theo type nếu cần
        let customFileName = response.fileName;
        if (!customFileName || customFileName === "degrees_all.xlsx") {
          switch (type) {
            case "approved":
              customFileName = t(
                "degrees.exportFileApproved",
                "degrees_approved.xlsx"
              );
              break;
            case "pending":
              customFileName = t(
                "degrees.exportFilePending",
                "degrees_pending.xlsx"
              );
              break;
            case "rejected":
              customFileName = t(
                "degrees.exportFileRejected",
                "degrees_rejected.xlsx"
              );
              break;
            default:
              customFileName = t("degrees.exportFileAll", "degrees_all.xlsx");
          }
        }
        setFileInfo({
          fileName: customFileName,
          blob: response.blob,
        });
      },
      onError: () => {
        // Có thể show toast hoặc thông báo lỗi
      },
    });
  };

  const handleDownload = () => {
    if (!fileInfo) return;
    const { fileName, blob } = fileInfo;
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      fileName || t("degrees.exportFileAll", "degrees_all.xlsx")
    );
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
    setOpen(false);
    setFileInfo(null);
  };

  // Reset fileInfo khi đóng dialog
  const handleDialogChange = (v: boolean) => {
    setOpen(v);
    if (!v) setFileInfo(null);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          {t("degrees.exportExcel")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md rounded-2xl shadow-2xl border border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Download className="h-6 w-6" />
            {t("degrees.exportTitle", "Export Degrees")}
          </DialogTitle>
        </DialogHeader>
        <div className="py-2">
          <div className="mb-4">
            <Select
              value={type}
              onValueChange={(v) => {
                setType(v);
                setFileInfo(null);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={t("degrees.type", "Chọn loại bằng cấp")}
                />
              </SelectTrigger>
              <SelectContent defaultValue={typeTab}>
                <SelectItem value="all">
                  {t("degrees.allDegrees", "Tất cả")}
                </SelectItem>
                <SelectItem value="approved">
                  {t("degrees.approvedDegrees", "Đã duyệt")}
                </SelectItem>
                <SelectItem value="pending">
                  {t("degrees.pendingDegrees", "Chờ duyệt")}
                </SelectItem>
                <SelectItem value="rejected">
                  {t("degrees.rejectedDegrees", "Từ chối")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          {!fileInfo && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded flex items-center gap-3">
              <Download className="h-5 w-5 text-blue-600" />
              <span className="text-blue-700 text-sm">
                {t(
                  "degrees.exportDescription",
                  "Export all degrees to Excel file. Click Export to generate the file."
                )}
              </span>
            </div>
          )}
          {fileInfo && (
            <div className="mb-4 relative">
              <div className="space-y-4">
                <div className="bg-white border border-primary/30 rounded-2xl px-6 py-5 shadow-lg flex flex-col gap-3">
                  <span className="text-primary font-bold text-lg flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    {t("degrees.fileReady", "File ready to download:")}
                  </span>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="flex items-center gap-2 bg-primary/10 text-primary font-semibold px-4 py-2 rounded-lg border border-primary/20 text-base select-all">
                      <Download className="h-4 w-4" />
                      {fileInfo.fileName}
                    </span>
                  </div>
                  <span className="text-muted-foreground text-xs mt-1">
                    {t("degrees.size")}:{" "}
                    {(fileInfo.blob.size / 1024).toFixed(2)} KB
                  </span>
                </div>
              </div>
            </div>
          )}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-700 text-sm">
                {t("degrees.exportError", "Export failed")}
              </span>
            </div>
          )}
        </div>
        <DialogFooter className="gap-2 mt-2">
          <Button
            variant="outline"
            onClick={() => handleDialogChange(false)}
            disabled={isPending}
          >
            {t("common.cancel")}
          </Button>
          {!fileInfo ? (
            <Button
              variant="default"
              onClick={handleExport}
              disabled={isPending}
              className="font-semibold px-6"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("common.loading")}
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  {t("degrees.export")}
                </>
              )}
            </Button>
          ) : (
            <Button
              variant="default"
              onClick={handleDownload}
              className="font-semibold px-6 bg-primary hover:bg-primary/90 text-white border-none shadow-md"
            >
              <Download className="mr-2 h-4 w-4" />
              {t("degrees.download")}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
