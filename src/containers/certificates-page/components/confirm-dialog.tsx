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
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { useInvalidateByKey } from "@/hooks/use-invalidate-by-key";

interface ConfirmDialogProps {
  open: boolean;
  id: number;
  title?: string;
  description?: string;
}

export function ConfirmDialog({
  open,
  id,
  title,
  description,
}: ConfirmDialogProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    mutate: validateCertificate,
    isPending,
    error,
  } = useCertificatesValidation();
  const invalidateCertificates = useInvalidateByKey("certificate");

  const handleConfirm = () => {
    validateCertificate(id, {
      onSuccess: () => {
        // Show success message
        toast.success(t("certificates.confirmSuccess"));

        // Invalidate and refetch certificates list
        invalidateCertificates();
        router.back();
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
    <Dialog open={open}>
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
