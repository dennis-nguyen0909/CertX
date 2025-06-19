"use client";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useCertificatesValidation } from "@/hooks/certificates/use-certificates-validation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { Certificate } from "@/models/certificate";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  certificate: Certificate;
  title?: string;
  description?: string;
}

export function ConfirmDialog({
  open,
  onClose,
  certificate,
  title,
  description,
}: ConfirmDialogProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    mutate: validateCertificate,
    isPending,
    error,
  } = useCertificatesValidation();

  const handleConfirm = () => {
    validateCertificate(certificate.id, {
      onSuccess: () => {
        // Show success message
        toast.success(t("certificates.confirmSuccess"));

        // Invalidate and refetch certificates list
        queryClient.invalidateQueries({ queryKey: ["certificates-list"] });
        queryClient.invalidateQueries({
          queryKey: ["certificates-pending-list"],
        });

        // Navigate back
        router.back();
        onClose();
      },
      onError: (error) => {
        console.error("Error validating certificate:", error);
        toast.error(t("certificates.confirmError"));
      },
    });
  };

  console.log("error", error);

  const handleCancel = () => {
    router.back();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!isPending && !nextOpen) {
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {title || t("certificates.confirmAction")}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            {description || t("certificates.confirmActionDescription")}
          </p>
        </div>
        {error && (
          <div className="py-4">
            <p className="text-sm text-red-500">
              {isAxiosError(error)
                ? error.response?.data?.message ||
                  error.response?.data?.error ||
                  error.message
                : error.message}
            </p>
          </div>
        )}
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isPending}
            className="cursor-pointer"
          >
            {t("common.cancel")}
          </Button>
          <Button
            type="button"
            variant="default"
            onClick={handleConfirm}
            disabled={isPending}
            className="cursor-pointer"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("common.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
