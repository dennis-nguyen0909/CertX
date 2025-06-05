"use client";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Upload,
  FileText,
  AlertCircle,
  CheckCircle,
  Download,
} from "lucide-react";
import { useState, useRef } from "react";
import { useStudentCreateExcel } from "@/hooks/student";
import { useQueryClient } from "@tanstack/react-query";

interface ApiError extends Error {
  response?: {
    data?: {
      data?: string | string[];
    };
  };
}

export function ImportDialog() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | string[]>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: createExcel, isPending: isUploading } =
    useStudentCreateExcel();

  console.log("errorMessage", errorMessage);

  const handleDownloadTemplate = () => {
    // Download the Excel template file
    const link = document.createElement("a");
    link.href = "/templates/sinh_vien_mau.xlsx";
    link.download = "sinh_vien_mau.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/csv",
      ];

      if (
        !allowedTypes.includes(file.type) &&
        !file.name.match(/\.(xlsx|xls|csv)$/)
      ) {
        setErrorMessage(t("student.import.invalidFileType"));
        setUploadStatus("error");
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage(t("student.import.fileTooLarge"));
        setUploadStatus("error");
        return;
      }

      setSelectedFile(file);
      setUploadStatus("idle");
      setErrorMessage("");
    }
  };

  const handleImport = () => {
    if (!selectedFile) return;

    setUploadStatus("idle");
    setErrorMessage("");

    createExcel(selectedFile, {
      onSuccess: () => {
        setUploadStatus("success");
        // Invalidate and refetch the student list
        queryClient.invalidateQueries({
          queryKey: ["student-list"],
        });
        // Reset after success
        setTimeout(() => {
          setOpen(false);
          resetForm();
        }, 1500);
      },
      onError: (error: ApiError) => {
        setUploadStatus("error");
        setErrorMessage(
          error?.response?.data?.data || t("student.import.uploadFailed")
        );
      },
    });
  };

  const resetForm = () => {
    setSelectedFile(null);
    setUploadStatus("idle");
    setErrorMessage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCancel = () => {
    setOpen(false);
    resetForm();
  };

  const renderErrorMessage = () => {
    if (Array.isArray(errorMessage)) {
      return errorMessage.map((error, index) => (
        <div key={index} className="text-sm text-red-800">
          {error}
        </div>
      ));
    }
    return <div className="text-sm text-red-800">{errorMessage}</div>;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="h-4 w-4 mr-2" />
          {t("common.import")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Upload className="h-6 w-6" />
            {t("student.import.title")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8">
          {/* Step 1: Download Template */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-gray-900">
                {t("student.import.step1.title")}
              </h3>
            </div>
            <div className="ml-0 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Download className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-blue-700 mb-3">
                    {t("student.import.step1.description")}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadTemplate}
                    className="border-blue-300 text-blue-700 hover:bg-blue-100"
                    disabled={isUploading}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {t("student.import.downloadTemplate")}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Prepare Data */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-gray-900">
                {t("student.import.step2.title")}
              </h3>
            </div>
            <div className="ml-0 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="space-y-3">
                <p className="text-sm text-gray-700">
                  {t("student.import.step2.description")}
                </p>
                <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside ml-4">
                  <li>{t("student.import.step2.rule1")}</li>
                  <li>{t("student.import.step2.rule2")}</li>
                  <li>{t("student.import.step2.rule3")}</li>
                  <li>{t("student.import.step2.rule4")}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Step 3: Upload File */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-gray-900">
                {t("student.import.step3.title")}
              </h3>
            </div>
            <div className="ml-0 space-y-4">
              <div className="space-y-3">
                <Label htmlFor="file-upload" className="text-base font-medium">
                  {t("student.import.selectFile")}
                </Label>
                <div className="space-y-2">
                  <Input
                    ref={fileInputRef}
                    id="file-upload"
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileSelect}
                    disabled={isUploading}
                    className="cursor-pointer h-12 text-base"
                  />
                  <p className="text-sm text-muted-foreground">
                    {t("student.import.supportedFormats")}
                  </p>
                </div>
              </div>

              {/* Selected File Info */}
              {selectedFile && (
                <div className="flex items-center gap-3 p-4 bg-muted rounded-lg border">
                  <FileText className="h-6 w-6 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / 1024).toFixed(1)} KB •{" "}
                      {selectedFile.type || t("student.import.unknownType")}
                    </p>
                  </div>
                </div>
              )}

              {/* Upload Progress */}
              {isUploading && (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">
                      {t("student.import.uploading")}
                    </span>
                    <span className="text-muted-foreground">
                      {t("student.import.pleaseWait")}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-primary h-3 rounded-full animate-pulse"
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Status Messages */}
              {uploadStatus === "success" && (
                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">
                      {t("student.import.success")}
                    </p>
                    <p className="text-sm text-green-700">
                      {t("student.import.successDescription")}
                    </p>
                  </div>
                </div>
              )}

              {uploadStatus === "error" && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-red-800 mb-2">
                      {t("student.import.error")}
                    </p>
                    <div className="text-sm text-red-700">
                      {errorMessage
                        ? renderErrorMessage()
                        : t("student.import.errorDescription")}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isUploading}
              size="lg"
            >
              {t("common.cancel")}
            </Button>
            <Button
              onClick={handleImport}
              disabled={
                !selectedFile || isUploading || uploadStatus === "success"
              }
              size="lg"
              className="min-w-[120px]"
            >
              {isUploading ? t("student.import.importing") : t("common.import")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
