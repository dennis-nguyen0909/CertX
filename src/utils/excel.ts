import * as XLSX from "xlsx";
import { useEffect } from "react";

// Parse error messages dạng 'Dòng 2: ...' thành object ánh xạ dòng lỗi
export function getErrorRowMap(
  errorMessage: string[] | string
): Record<number, string> {
  const errorRowMap: Record<number, string> = {};
  if (Array.isArray(errorMessage)) {
    errorMessage.forEach((msg) => {
      const match = msg.match(/Dòng\s*(\d+):?\s*(.*)/i);
      if (match) {
        errorRowMap[Number(match[1])] = match[2] || msg;
      }
    });
  }
  return errorRowMap;
}

// Parse file Excel thành mảng string[][]
export function parseExcelFile(file: File): Promise<string[][]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json<string[]>(worksheet, {
          header: 1,
        });
        resolve(json as string[][]);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

// Custom hook: Tự động parse file Excel khi dialog mở
export function useAutoParseExcelOnOpen({
  open,
  file,
  setExcelData,
  excelData,
}: {
  open: boolean;
  file: File | null;
  setExcelData: (data: string[][]) => void;
  excelData: string[][] | null;
}) {
  useEffect(() => {
    if (open && file && !excelData) {
      parseExcelFile(file).then(setExcelData);
    }
    if (!open) {
      setExcelData([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, file, excelData]);
}
