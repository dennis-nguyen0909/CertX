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

// Hàm chuyển serial date của Excel sang chuỗi dd/MM/yyyy
function excelDateToString(serial: number) {
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;
  const date_info = new Date(utc_value * 1000);
  const day = String(date_info.getUTCDate()).padStart(2, "0");
  const month = String(date_info.getUTCMonth() + 1).padStart(2, "0");
  const year = date_info.getUTCFullYear();
  return `${day}/${month}/${year}`;
}

// Hàm chuẩn hóa chuỗi ngày tháng về dd/MM/yyyy
function normalizeDateString(dateStr: string): string {
  // Nhận các chuỗi dạng 1/1/24, 1/1/2024, 01/01/2024, ... => trả về dd/MM/yyyy
  const parts = dateStr.split(/[\/\-]/);
  if (parts.length === 3) {
    let [d, m, y] = parts;
    d = d.padStart(2, "0");
    m = m.padStart(2, "0");
    if (y.length === 2) y = "20" + y; // Xử lý năm 2 số thành 4 số
    return `${d}/${m}/${y}`;
  }
  return dateStr;
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
          raw: false, // Đọc ngày tháng dưới dạng chuỗi nếu có thể
        });

        // Tìm index cột ngày sinh (nếu có)
        const header = json[0] as string[];
        const dobIndex = header.findIndex(
          (col) =>
            col.toLowerCase().includes("ngày sinh") ||
            col.toLowerCase().includes("dob")
        );

        // Chuyển đổi ngày sinh nếu là số hoặc chuẩn hóa chuỗi
        const dataRows = json.slice(1).map((row) => {
          if (dobIndex !== -1) {
            const val = row[dobIndex];
            if (typeof val === "number" && !isNaN(val)) {
              row[dobIndex] = excelDateToString(val);
            } else if (typeof val === "string" && val.trim() !== "") {
              row[dobIndex] = normalizeDateString(val.trim());
            }
          }
          return row;
        });

        resolve([header, ...dataRows]);
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
