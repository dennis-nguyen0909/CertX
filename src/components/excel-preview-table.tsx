import React from "react";
import * as XLSX from "xlsx";
import { Button } from "./ui/button";

interface ExcelPreviewTableProps {
  excelData: string[][];
  getErrorRowMap?: () => Record<number, string>;
  showExport?: boolean;
  fileNameNoError?: string;
  fileNameError?: string;
  className?: string;
}

export const ExcelPreviewTable: React.FC<ExcelPreviewTableProps> = ({
  excelData,
  getErrorRowMap,
  showExport = true,
  fileNameNoError = "danh_sach_khong_loi.xlsx",
  fileNameError = "danh_sach_loi.xlsx",
  className = "",
}) => {
  const errorRowMap = getErrorRowMap ? getErrorRowMap() : {};
  const hasError = Object.keys(errorRowMap).length > 0;

  // Lọc dòng trống, luôn giữ header
  const filteredExcelData = excelData.filter(
    (row, i) => i === 0 || row.some((cell) => String(cell).trim() !== "")
  );

  // Export file không lỗi
  const handleExportNoError = () => {
    const header = filteredExcelData[0];
    const dataRows = filteredExcelData.slice(1);
    const noErrorRows = dataRows.filter((_, idx) => !errorRowMap[idx + 1]);
    const noErrorData = [header, ...noErrorRows];
    const ws = XLSX.utils.aoa_to_sheet(noErrorData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, fileNameNoError);
  };

  // Export file có lỗi
  const handleExportError = () => {
    const header = filteredExcelData[0];
    const dataRows = filteredExcelData.slice(1);
    const errorRows = dataRows.filter((_, idx) => !!errorRowMap[idx + 1]);
    const errorData = [header, ...errorRows];
    const ws = XLSX.utils.aoa_to_sheet(errorData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, fileNameError);
  };

  return (
    <div
      className={`border rounded bg-background p-2 max-h-[40vh] overflow-auto ${className}`}
    >
      {showExport && (
        <div className="flex gap-2 mb-2 justify-end">
          <Button
            className=" text-primary-foreground"
            onClick={handleExportNoError}
          >
            Export không lỗi
          </Button>
          {hasError && (
            <Button
              className="bg-red-100 text-red-700 hover:bg-red-200"
              onClick={handleExportError}
            >
              Export có lỗi
            </Button>
          )}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full border text-xs">
          <tbody>
            {filteredExcelData.map((row, i) => {
              const isHeader = i === 0;
              if (isHeader) {
                return (
                  <tr key={i} className="font-bold bg-muted">
                    {row.map((cell, j) => (
                      <td
                        key={j}
                        className="border px-2 py-1 whitespace-pre-line"
                      >
                        {cell}
                      </td>
                    ))}
                    {getErrorRowMap && (
                      <td className="border px-2 py-1 whitespace-pre-line text-center">
                        Lỗi
                      </td>
                    )}
                  </tr>
                );
              }
              const errorText = getErrorRowMap ? errorRowMap[i] || "" : "";
              const isError = !!errorText;
              return (
                <tr
                  key={i}
                  className={`${isError ? "bg-red-100 text-red-700" : ""}`}
                >
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className="border px-2 py-1 whitespace-pre-line"
                    >
                      {cell}
                    </td>
                  ))}
                  {getErrorRowMap && (
                    <td className="border px-2 py-1 whitespace-pre-line text-red-700">
                      {errorText}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
