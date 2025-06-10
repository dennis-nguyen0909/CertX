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

interface ConfirmDialogProps {
  open: boolean;
  id: string;
}

export function ConfirmDialog({ open, id }: ConfirmDialogProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: validateCertificate, isPending } =
    useCertificatesValidation();

  const handleConfirm = () => {
    validateCertificate(parseInt(id), {
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
      },
      onError: (error) => {
        console.error("Error validating certificate:", error);
        toast.error(t("certificates.confirmError"));
      },
    });
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <Dialog open={open} onOpenChange={() => router.back()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {t("certificates.confirmAction")}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            {t("certificates.confirmActionDescription")}
          </p>
        </div>
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
