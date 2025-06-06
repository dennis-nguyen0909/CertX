"use client";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, Loader } from "lucide-react";
import { useCertificatesExcel } from "@/hooks/certificates/use-certificates-excel";
import { useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";

export function ExcelUploadDialog() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const {
    mutate: uploadExcel,
    isPending,
    error,
    data: uploadResult,
  } = useCertificatesExcel();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      uploadExcel(selectedFile, {
        onSuccess: () => {
          // Invalidate and refetch the certificates list
          queryClient.invalidateQueries({ queryKey: ["certificates-list"] });
          setSelectedFile(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        },
      });
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="mr-2 h-4 w-4" />
          {t("certificates.uploadExcel")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("certificates.uploadExcelFile")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">
              {t("certificates.selectExcelFile")}
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileSelect}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mt-2"
            />
            {selectedFile && (
              <p className="text-sm text-gray-600 mt-2">
                {t("certificates.selectedFile")}: {selectedFile.name}
              </p>
            )}
          </div>

          {uploadResult && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <h4 className="text-sm font-medium text-green-800">
                {t("certificates.uploadSuccess")}
              </h4>
              <p className="text-sm text-green-700 mt-1">
                {t("certificates.totalProcessed")}:{" "}
                {uploadResult.data.totalProcessed}
              </p>
              <p className="text-sm text-green-700">
                {t("certificates.successCount")}:{" "}
                {uploadResult.data.successCount}
              </p>
              {uploadResult.data.errorCount > 0 && (
                <p className="text-sm text-red-700">
                  {t("certificates.errorCount")}: {uploadResult.data.errorCount}
                </p>
              )}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-700">
                {typeof error === "object" &&
                error !== null &&
                "response" in error
                  ? (error as { response: { data: { message: string } } })
                      .response.data.message
                  : t("common.errorOccurred")}
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
            >
              {t("common.cancel")}
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || isPending}
            >
              {isPending && <Loader className="mr-2 h-4 w-4 animate-spin" />}
              {t("certificates.upload")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
