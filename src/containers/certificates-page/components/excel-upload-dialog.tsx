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
import { useCertificatesExcel } from "@/hooks/certificates/use-certificates-excel";
import { useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CertificateTypeSelect } from "@/components/single-select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormControl } from "@/components/ui/form";
import FormItem from "@/components/ui/form-item";
import { z } from "zod";
import { ExcelPreviewTable } from "@/components/excel-preview-table";
import { parseExcelFile, getErrorRowMap } from "@/utils/excel";

interface ApiError extends Error {
  response?: {
    data?: {
      data?: string | string[];
      message?: string;
    };
  };
}

// Schema chỉ cho certificateTypeId (string, required)
const excelUploadSchema = (t: (key: string) => string) =>
  z.object({
    certificateTypeId: z.string().min(1, t("common.required")),
  });

type ExcelUploadFormData = z.infer<ReturnType<typeof excelUploadSchema>>;

export function ExcelUploadDialog() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | string[]>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const [excelData, setExcelData] = useState<string[][] | null>(null);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);

  const {
    mutate: uploadExcel,
    isPending: isUploading,
    data: uploadResult,
  } = useCertificatesExcel();

  const form = useForm<ExcelUploadFormData>({
    resolver: zodResolver(excelUploadSchema(t)),
    defaultValues: { certificateTypeId: "" },
  });

  const handleDownloadTemplate = () => {
    // Download the Excel template file for certificates
    const link = document.createElement("a");
    link.href = "/templates/them_chung_chi_mau.xlsx";
    link.download = "them_chung_chi_mau.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
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
        setExcelData(null);
        return;
      }
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage(t("certificates.import.fileTooLarge"));
        setUploadStatus("error");
        setExcelData(null);
        return;
      }
      setSelectedFile(file);
      setUploadStatus("idle");
      setErrorMessage("");
      // Parse file excel
      try {
        const data = await parseExcelFile(file);
        setExcelData(data);
      } catch {
        setExcelData(null);
      }
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      setErrorMessage(t("certificates.import.selectFileRequired"));
      setUploadStatus("error");
      return;
    }
    // Lấy certificateTypeId từ form
    const { certificateTypeId } = form.getValues();
    if (!certificateTypeId) {
      setErrorMessage(t("certificates.import.selectCertificateTypeRequired"));
      setUploadStatus("error");
      return;
    }
    setUploadStatus("idle");
    setErrorMessage("");
    uploadExcel(
      { file: selectedFile, certificateTypeId },
      {
        onSuccess: () => {
          setUploadStatus("success");
          queryClient.invalidateQueries({ queryKey: ["certificates-list"] });
          setTimeout(() => {
            setOpen(false);
            resetForm();
            form.reset();
          }, 2000);
        },
        onError: (error: ApiError) => {
          setUploadStatus("error");
          // Handle detailed error response
          const errorResponse = error?.response?.data;
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
        },
      }
    );
  };

  const resetForm = () => {
    setSelectedFile(null);
    setUploadStatus("idle");
    setErrorMessage("");
    setExcelData(null);
    setErrorDialogOpen(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    form.reset();
  };

  const handleCancel = () => {
    setOpen(false);
    resetForm();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (isUploading) return;
        setOpen(v);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="mr-2 h-4 w-4" />
          {t("certificates.uploadExcel")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Upload className="h-6 w-6" />
            {t("certificates.import.title")}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
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
                      disabled={isUploading}
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
                    {t("certificates.import.step2.description")}
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside ml-4">
                    <li>{t("certificates.import.step2.rule1")}</li>
                    <li>{t("certificates.import.step2.rule2")}</li>
                    <li>{t("certificates.import.step2.rule3")}</li>
                    <li>{t("certificates.import.step2.rule4")}</li>
                    <li>{t("certificates.import.step2.rule5")}</li>
                    <li>{t("certificates.import.step2.rule6")}</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Step 3: Select Certificate Type */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  {t("certificates.import.step3.title")}
                </h3>
              </div>
              <div className="ml-0 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="space-y-3">
                  <p className="text-sm text-yellow-700">
                    {t("certificates.import.step3.description")}
                  </p>
                  <FormField
                    control={form.control}
                    name="certificateTypeId"
                    render={({ field }) => (
                      <FormItem
                        label={t("certificates.certificateType")}
                        required
                        inputComponent={
                          <FormControl>
                            <div className="w-full">
                              <CertificateTypeSelect
                                placeholder={t(
                                  "certificates.selectCertificateType"
                                )}
                                defaultValue={
                                  field.value
                                    ? { value: String(field.value), label: "" }
                                    : null
                                }
                                onChange={(value) =>
                                  field.onChange(value ? value.value : "")
                                }
                              />
                            </div>
                          </FormControl>
                        }
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Step 4: Upload File */}
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
                      isUploading
                        ? "bg-gray-100 border-gray-200"
                        : "hover:border-blue-400 hover:bg-blue-50"
                    }`}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (isUploading) return;
                      const file = e.dataTransfer.files?.[0];
                      if (file) {
                        // Tạo một đối tượng giống sự kiện input
                        const event = {
                          target: { files: [file] },
                        } as unknown as React.ChangeEvent<HTMLInputElement>;
                        handleFileSelect(event);
                      }
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDragLeave={(e) => e.preventDefault()}
                    onClick={() =>
                      !isUploading && fileInputRef.current?.click()
                    }
                    style={{ cursor: isUploading ? "not-allowed" : "pointer" }}
                  >
                    <input
                      ref={fileInputRef}
                      id="file-upload"
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileSelect}
                      disabled={isUploading}
                      className="hidden"
                    />
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Upload className="h-8 w-8 text-blue-400 mb-2" />
                      <span className="text-base font-medium text-blue-700">
                        {t("certificates.import.dragDropOrClick") ||
                          "Kéo thả hoặc bấm để chọn file Excel"}
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
                {isUploading && (
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
                {uploadStatus === "success" && uploadResult && (
                  <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800">
                        {t("certificates.import.success")}
                      </p>
                      <div className="text-sm text-green-700 mt-2 space-y-1">
                        <p>
                          {t("certificates.totalProcessed")}:{" "}
                          {uploadResult.data.totalProcessed}
                        </p>
                        <p>
                          {t("certificates.successCount")}:{" "}
                          {uploadResult.data.successCount}
                        </p>
                        {uploadResult.data.errorCount > 0 && (
                          <p className="text-red-700">
                            {t("certificates.errorCount")}:{" "}
                            {uploadResult.data.errorCount}
                          </p>
                        )}
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
                onClick={handleUpload}
                disabled={
                  !selectedFile || isUploading || uploadStatus === "success"
                }
                size="lg"
                className="min-w-[120px]"
              >
                {isUploading
                  ? t("certificates.import.importing")
                  : t("certificates.upload")}
              </Button>
            </div>
          </div>
        </Form>
      </DialogContent>

      {/* Dialog lỗi Excel */}
      <Dialog
        open={errorDialogOpen}
        onOpenChange={(v) => {
          setErrorDialogOpen(v);
          if (!v) setExcelData(null);
        }}
      >
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto w-auto  sm:max-w-none">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-red-700 flex items-center gap-2">
              <AlertCircle className="h-6 w-6 text-red-600" />
              {t("certificates.import.error")}
            </DialogTitle>
          </DialogHeader>
          <div className="mb-4">
            <p className="text-red-700 font-medium mb-2">
              {t("certificates.import.errorDescription")}
            </p>
            {excelData &&
              Array.isArray(errorMessage) &&
              errorMessage.length > 0 && (
                <ExcelPreviewTable
                  excelData={excelData}
                  getErrorRowMap={() => getErrorRowMap(errorMessage)}
                />
              )}
          </div>
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setErrorDialogOpen(false);
                setExcelData(null);
              }}
            >
              {t("common.close")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
