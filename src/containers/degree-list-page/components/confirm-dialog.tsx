import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Degree } from "@/models/degree";
import { useDegreeValidation } from "@/hooks/degree/use-degree-validation";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  degree: Degree;
  title?: string;
  description?: string;
}

// Type guard cho AxiosError-like
function isAxiosErrorWithMessage(
  error: unknown
): error is { response: { data: { message: string } } } {
  return (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as { response?: unknown }).response === "object" &&
    (error as { response?: unknown }).response !== null &&
    "data" in (error as { response: { data?: unknown } }).response! &&
    typeof (error as { response: { data?: unknown } }).response.data ===
      "object" &&
    (error as { response: { data?: unknown } }).response.data !== null &&
    "message" in
      (error as { response: { data: { message?: unknown } } }).response.data!
  );
}

function isErrorWithMessage(error: unknown): error is { message: string } {
  return typeof error === "object" && error !== null && "message" in error;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onClose,
  degree,
  title,
  description,
}) => {
  const { t } = useTranslation();
  const confirmMutation = useDegreeValidation();
  const queryClient = useQueryClient();

  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleConfirm = () => {
    confirmMutation.mutate(degree.id, {
      onSuccess: () => {
        onClose();
        setErrorMessage("");
        queryClient.invalidateQueries({
          queryKey: ["degree-list"],
        });
        queryClient.invalidateQueries({
          queryKey: ["degree-pending-list"],
        });
      },
      onError: (error: unknown) => {
        let msg = "";
        if (isAxiosErrorWithMessage(error)) {
          msg = error.response.data.message;
        } else if (isErrorWithMessage(error)) {
          msg = error.message;
        } else {
          msg = t("common.error");
        }
        setErrorMessage(msg);
      },
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!confirmMutation.isPending && !nextOpen) {
          onClose();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title || t("common.confirm")}</DialogTitle>
        </DialogHeader>
        <div>{description || t("degrees.confirmActionDescription")}</div>
        {errorMessage && (
          <div className="text-red-500 text-sm mt-2 w-full text-left">
            {errorMessage}
          </div>
        )}
        <DialogFooter>
          <Button onClick={handleConfirm} disabled={confirmMutation.isPending}>
            {confirmMutation.isPending
              ? t("common.loading")
              : t("degrees.confirmAction")}
          </Button>
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={confirmMutation.isPending}
          >
            {t("common.cancel")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
