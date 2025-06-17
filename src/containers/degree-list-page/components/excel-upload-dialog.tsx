import React, { useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ExcelUploadDialogProps {
  open: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
}

export const ExcelUploadDialog: React.FC<ExcelUploadDialogProps> = ({
  open,
  onClose,
  onUpload,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = () => {
    const file = fileInputRef.current?.files?.[0];
    if (file) {
      onUpload(file);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nhập văn bằng từ Excel</DialogTitle>
        </DialogHeader>
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          className="mb-4"
        />
        <DialogFooter>
          <Button onClick={handleUpload}>Tải lên</Button>
          <Button variant="ghost" onClick={onClose}>
            Hủy
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
