"use client";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Upload,
  FileText,
  AlertCircle,
  CheckCircle,
  Download,
} from "lucide-react";
import { DegreeService } from "@/services/degree/degree.service";
import { useState, useRef, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ExcelPreviewTable } from "@/components/excel-preview-table";
import { getErrorRowMap, parseExcelFile } from "@/utils/excel";

interface ApiError extends Error {
  response?: {
    data?: {
      data?: string | string[];
      message?: string;
    };
  };
}

export function ExcelUploadDialog() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | string[]>("");
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const [excelData, setExcelData] = useState<string[][] | null>(null);

  const handleDownloadTemplate = () => {
    // Download the Excel template file for degrees
    const link = document.createElement("a");
    link.href = "/templates/them_van_bang_mau.xlsx";
    link.download = "them_van_bang_mau.xlsx";
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
      ];

      if (
        !allowedTypes.includes(file.type) &&
        !file.name.match(/\.(xlsx|xls)$/)
      ) {
        setErrorMessage(t("certificates.import.invalidFileType"));
        setUploadStatus("error");
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage(t("certificates.import.fileTooLarge"));
        setUploadStatus("error");
        return;
      }

      setSelectedFile(file);
      setUploadStatus("idle");
      setErrorMessage("");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setErrorMessage(t("certificates.import.selectFileRequired"));
      setUploadStatus("error");
      return;
    }

    setUploadStatus("uploading");
    setErrorMessage("");

    try {
      await DegreeService.createDegreeFromExcel(selectedFile);
      setUploadStatus("success");
      queryClient.invalidateQueries({ queryKey: ["degrees-list"] });
      setTimeout(() => {
        setOpen(false);
        resetForm();
      }, 2000);
    } catch (error) {
      setUploadStatus("error");
      const errorResponse = (error as ApiError)?.response?.data;
      if (errorResponse?.data && Array.isArray(errorResponse.data)) {
        setErrorMessage(errorResponse.data);
        setErrorDialogOpen(true);
      } else if (errorResponse?.message) {
        setErrorMessage(errorResponse.message);
      } else if (
        errorResponse?.data &&
        typeof errorResponse.data === "string"
      ) {
        setErrorMessage(errorResponse.data);
      } else {
        setErrorMessage(t("certificates.import.uploadFailed"));
      }
    }
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

  const handleReviewExcel = async () => {
    if (!selectedFile) return;
    const data = await parseExcelFile(selectedFile);
    setExcelData(data);
  };

  // Tự động đọc file Excel khi mở dialog lỗi
  useEffect(() => {
    if (errorDialogOpen && selectedFile && !excelData) {
      handleReviewExcel();
    }
    // Reset preview khi đóng dialog
    if (!errorDialogOpen) {
      setExcelData(null);
    }
  }, [errorDialogOpen, selectedFile, excelData]);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            {t("degrees.uploadExcel")}
          </Button>
        </DialogTrigger>
        <DialogContent
          className="max-w-3xl max-h-[80vh] overflow-y-auto"
          onInteractOutside={
            uploadStatus === "uploading" ? (e) => e.preventDefault() : undefined
          }
          onEscapeKeyDown={
            uploadStatus === "uploading" ? (e) => e.preventDefault() : undefined
          }
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Upload className="h-6 w-6" />
              {t("degrees.import.title")}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-8">
            {/* Step 1: Download Template */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  {t("certificates.import.step1.title")}
                </h3>
              </div>
              <div className="ml-0 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Download className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-blue-700 mb-3">
                      {t("certificates.import.step1.description")}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadTemplate}
                      className="border-blue-300 text-blue-700 hover:bg-blue-100"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {t("certificates.import.downloadTemplate")}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Prepare Data */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  {t("certificates.import.step2.title")}
                </h3>
              </div>
              <div className="ml-0 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="space-y-3">
                  <p className="text-sm text-gray-700">
                    Điền thông tin văn bằng vào file Excel với các cột sau:
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside ml-4">
                    <li>STT: Số thứ tự (1, 2, 3...)</li>
                    <li>
                      Mã sinh viên: Phải là duy nhất và khớp với sinh viên hiện
                      có
                    </li>
                    <li>Tên sinh viên: Tên đầy đủ của sinh viên</li>
                    <li>Lớp: Tên lớp của sinh viên</li>
                    <li>Khoa: Tên khoa quản lý</li>
                    <li>Năm tốt nghiệp: Năm sinh viên tốt nghiệp</li>
                    <li>Số hiệu văn bằng: Số hiệu duy nhất của văn bằng</li>
                    <li>Ngày cấp: Định dạng DD/MM/YYYY</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Step 3: Upload File */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  {t("certificates.import.step4.title")}
                </h3>
              </div>
              <div className="ml-0 space-y-4">
                <div className="space-y-3">
                  <Label
                    htmlFor="file-upload"
                    className="text-base font-medium"
                  >
                    {t("certificates.import.selectFile")}
                  </Label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 ${
                      uploadStatus === "success"
                        ? "bg-gray-100 border-gray-200"
                        : "hover:border-blue-400 hover:bg-blue-50"
                    }`}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (uploadStatus === "success") return;
                      const file = e.dataTransfer.files?.[0];
                      if (file) {
                        const event = {
                          target: { files: [file] },
                        } as unknown as React.ChangeEvent<HTMLInputElement>;
                        handleFileSelect(event);
                      }
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDragLeave={(e) => e.preventDefault()}
                    onClick={() =>
                      uploadStatus !== "success" &&
                      fileInputRef.current?.click()
                    }
                    style={{
                      cursor:
                        uploadStatus === "success" ? "not-allowed" : "pointer",
                    }}
                  >
                    <input
                      ref={fileInputRef}
                      id="file-upload"
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileSelect}
                      disabled={uploadStatus === "success"}
                      className="hidden"
                    />
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Upload className="h-8 w-8 text-blue-400 mb-2" />
                      <span className="text-base font-medium text-blue-700">
                        {t("certificates.import.dragDropOrClick")}
                      </span>
                      <span className="text-sm text-gray-500">
                        {t("certificates.import.supportedFormats")}
                      </span>
                    </div>
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
                        {selectedFile.type ||
                          t("certificates.import.unknownType")}
                      </p>
                    </div>
                  </div>
                )}

                {/* Upload Progress */}
                {uploadStatus === "uploading" && (
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">
                        {t("certificates.import.uploading")}
                      </span>
                      <span className="text-muted-foreground">
                        {t("certificates.import.pleaseWait")}
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
                        {t("certificates.import.success")}
                      </p>
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
                disabled={uploadStatus === "success"}
                size="lg"
              >
                {t("common.cancel")}
              </Button>
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || uploadStatus === "success"}
                size="lg"
                className="min-w-[120px]"
              >
                {t("certificates.upload")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Error Review Dialog */}
      <Dialog open={errorDialogOpen} onOpenChange={setErrorDialogOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto w-auto  sm:max-w-none">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl text-red-700">
              <AlertCircle className="h-6 w-6 text-red-600" />
              {t("certificates.import.error")}
            </DialogTitle>
          </DialogHeader>
          {/* Excel Preview Table */}
          {excelData && (
            <ExcelPreviewTable
              excelData={excelData}
              getErrorRowMap={() => getErrorRowMap(errorMessage)}
              showExport
            />
          )}
          <div className="flex justify-end pt-2 gap-2">
            {selectedFile && !excelData && (
              <Button variant="secondary" onClick={handleReviewExcel}>
                {t("certificates.import.reviewFile")}
              </Button>
            )}
            <Button variant="outline" onClick={() => setErrorDialogOpen(false)}>
              {t("common.close")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
