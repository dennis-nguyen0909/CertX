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
import { useState, useRef, useCallback } from "react";
import { useImportClassOfDepartment } from "@/hooks/user/use-import-class-of-department";
import { useInvalidateByKey } from "@/hooks/use-invalidate-by-key";
import { DepartmentSelect } from "@/components/single-select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormControl } from "@/components/ui/form";
import FormItem from "@/components/ui/form-item";
import { z } from "zod";
import { ExcelPreviewTable } from "@/components/excel-preview-table";
import { parseExcelFile, getErrorRowMap } from "@/utils/excel";
import { isAxiosError } from "axios";

interface ApiError extends Error {
  response?: {
    data?: {
      data?: string | string[];
      message?: string;
    };
  };
}

const excelUploadSchema = (t: (key: string) => string) =>
  z.object({
    departmentId: z.string().min(1, t("common.required")),
  });

type ExcelUploadFormData = z.infer<ReturnType<typeof excelUploadSchema>>;

export function ImportDialog() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | string[]>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [excelData, setExcelData] = useState<string[][] | null>(null);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);

  const queryClient = useInvalidateByKey("class");
  const {
    mutate: mutateImportClassOfDepartment,
    isPending,
    error: errorImport,
  } = useImportClassOfDepartment();

  const form = useForm<ExcelUploadFormData>({
    resolver: zodResolver(excelUploadSchema(t)),
    defaultValues: { departmentId: "" },
  });

  const handleDownloadTemplate = () => {
    const link = document.createElement("a");
    link.href = "/templates/them_lop_mau.xlsx";
    link.download = "them_lop_mau.xlsx";
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
        "text/csv",
      ];
      if (
        !allowedTypes.includes(file.type) &&
        !file.name.match(/\.(xlsx|xls|csv)$/)
      ) {
        setErrorMessage(t("class.import.invalidFileType"));
        setUploadStatus("error");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage(t("class.import.fileTooLarge"));
        setUploadStatus("error");
        return;
      }
      setSelectedFile(file);
      setUploadStatus("idle");
      setErrorMessage("");

      try {
        const data = await parseExcelFile(file);
        setExcelData(data);
      } catch (error) {
        if (error instanceof Error) {
          setErrorMessage(error.message);
          setUploadStatus("error");
        } else {
          setErrorMessage(t("class.import.unknownError"));
          setUploadStatus("error");
        }
      }
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      setErrorMessage(t("class.import.selectFileRequired"));
      setUploadStatus("error");
      return;
    }

    const valid = await form.trigger("departmentId");
    if (!valid) {
      setErrorMessage(t("class.import.departmentRequired"));
      setUploadStatus("error");
      return;
    }

    setUploadStatus("idle");
    setErrorMessage("");

    mutateImportClassOfDepartment(
      {
        file: selectedFile,
        departmentId: form.getValues().departmentId,
      },
      {
        onSuccess: () => {
          setUploadStatus("success");
          queryClient();
          setTimeout(() => {
            setOpen(false);
            resetForm();
            form.reset();
          }, 2000);
        },
        onError: (error: ApiError) => {
          setUploadStatus("error");
          const errorResponse = error?.response?.data;
          if (errorResponse?.message === "File Excel không chứa dữ liệu") {
            setErrorMessage(errorResponse.message);
            setErrorDialogOpen(false);
          } else if (errorResponse?.data && Array.isArray(errorResponse.data)) {
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
            setErrorMessage(t("class.import.uploadFailed"));
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
  };

  const handleCancel = () => {
    setOpen(false);
    resetForm();
  };

  // Prevent closing dialog while importing
  const handleDialogOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (isPending) return; // Do not allow closing while importing
      setOpen(nextOpen);
      if (!nextOpen) {
        resetForm();
      }
    },
    [isPending]
  );

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

  const isInvalidDataError =
    isAxiosError(errorImport) &&
    errorImport.response?.data.message === "Dữ liệu không hợp lệ";

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
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
            {t("class.import.title")}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <div className="space-y-8">
            {/* Step 1: Download Template */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  {t("class.import.step1.title")}
                </h3>
              </div>
              <div className="ml-0 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Download className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-blue-700 mb-3">
                      {t("class.import.step1.description")}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadTemplate}
                      className="border-blue-300 text-blue-700 hover:bg-blue-100"
                      disabled={isPending}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {t("class.import.downloadTemplate")}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Prepare Data */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  {t("class.import.step2.title")}
                </h3>
              </div>
              <div className="ml-0 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="space-y-3">
                  <p className="text-sm text-gray-700">
                    {t("class.import.step2.description")}
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside ml-4">
                    <li>{t("class.import.step2.rule1")}</li>
                    <li>{t("class.import.step2.rule2")}</li>
                    <li>{t("class.import.step2.rule3")}</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Step 3: Select Department */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  {t("class.import.step3.title")}
                </h3>
              </div>
              <div className="ml-0 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="space-y-3">
                  <p className="text-sm text-blue-700">
                    {t("class.import.step3.description")}
                  </p>
                  <FormField
                    control={form.control}
                    name="departmentId"
                    render={({ field }) => (
                      <FormItem
                        label={t("class.department")}
                        required
                        inputComponent={
                          <FormControl>
                            <div className="w-full min-w-0">
                              <DepartmentSelect
                                placeholder={t("class.selectDepartment")}
                                defaultValue={
                                  field.value
                                    ? { value: String(field.value), label: "" }
                                    : null
                                }
                                onChange={(value) =>
                                  field.onChange(value ? value.value : "")
                                }
                                className="w-full"
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
                  {t("class.import.step4.title")}
                </h3>
              </div>
              <div className="ml-0 space-y-4">
                <div className="space-y-3">
                  <Label
                    htmlFor="file-upload"
                    className="text-base font-medium"
                  >
                    {t("class.import.selectFile")}
                  </Label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 ${
                      isPending
                        ? "bg-gray-100 border-gray-200"
                        : "hover:border-blue-400 hover:bg-blue-50"
                    }`}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (isPending) return;
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
                    onClick={() => !isPending && fileInputRef.current?.click()}
                    style={{ cursor: isPending ? "not-allowed" : "pointer" }}
                  >
                    <input
                      ref={fileInputRef}
                      id="file-upload"
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileSelect}
                      disabled={isPending}
                      className="hidden"
                    />
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Upload className="h-8 w-8 text-blue-400 mb-2" />
                      <span className="text-base font-medium text-blue-700">
                        {t("class.import.dragDropOrClick") ||
                          "Kéo thả hoặc bấm để chọn file Excel"}
                      </span>
                      <span className="text-sm text-gray-500">
                        {t("class.import.supportedFormats")}
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
                        {selectedFile.type || t("class.import.unknownType")}
                      </p>
                    </div>
                  </div>
                )}

                {/* Upload Progress */}
                {isPending && (
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">
                        {t("class.import.uploading")}
                      </span>
                      <span className="text-muted-foreground">
                        {t("class.import.pleaseWait")}
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
                        {t("class.import.success")}
                      </p>
                    </div>
                  </div>
                )}
                {!isInvalidDataError &&
                  uploadStatus === "error" &&
                  !errorDialogOpen && (
                    <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-red-800 mb-2">
                          {t("class.import.error")}
                        </p>
                        <div className="text-sm text-red-700">
                          {renderErrorMessage()}
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
                disabled={isPending}
                size="lg"
              >
                {t("common.cancel")}
              </Button>
              <Button
                onClick={handleImport}
                disabled={
                  !selectedFile || isPending || uploadStatus === "success"
                }
                size="lg"
                className="min-w-[120px]"
              >
                {isPending ? t("class.import.importing") : t("common.import")}
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
          // if (!v) setExcelData(null);
        }}
      >
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto sm:max-w-5xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-red-700 flex items-center gap-2">
              <AlertCircle className="h-6 w-6 text-red-600" />
              {t("class.import.error")}
            </DialogTitle>
          </DialogHeader>
          <div className="mb-4">
            <p className="text-red-700 font-medium mb-2">
              {t("class.import.errorDescription")}
            </p>
            {excelData &&
              Array.isArray(errorMessage) &&
              errorMessage.length > 0 && (
                <ExcelPreviewTable
                  excelData={excelData}
                  getErrorRowMap={() => getErrorRowMap(errorMessage)}
                  fileNameError="danh_sach_lop_loi.xlsx"
                  fileNameNoError="danh_sach_lop_khong_loi.xlsx"
                />
              )}
          </div>
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setErrorDialogOpen(false);
                // setExcelData(null);
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
