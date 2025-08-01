"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface ConfirmationDialogProps {
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  loading?: boolean;
  disabled?: boolean;
  zIndex?: number;
}

export default function ConfirmationDialog({
  onConfirm,
  title,
  description,
  confirmText,
  cancelText,
  children,
  open: controlledOpen,
  onOpenChange,
  loading = false,
  disabled = false,
  zIndex,
}: ConfirmationDialogProps) {
  const { t } = useTranslation();
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;
  const setOpen = onOpenChange || setUncontrolledOpen;

  const handleConfirm = () => {
    onConfirm();
    if (!loading && !controlledOpen) setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-lg" style={{ zIndex: zIndex || 1000 }}>
        <DialogHeader>
          {title && <DialogTitle>{title}</DialogTitle>}
        </DialogHeader>
        {description && (
          <div className="py-4">
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        )}
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading || disabled}
          >
            {cancelText || t("common.cancel")}
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={loading || disabled}
          >
            {loading && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
            {confirmText || t("common.confirm")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
