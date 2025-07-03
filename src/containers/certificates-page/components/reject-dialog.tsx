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
import { Loader2, AlertTriangle } from "lucide-react";
import { useCertificatesReject } from "@/hooks/certificates/use-certificates-reject";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useInvalidateByKey } from "@/hooks/use-invalidate-by-key";

interface RejectDialogProps {
  open: boolean;
  id: number;
}

export function RejectDialog({ open, id }: RejectDialogProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const invalidateCertificates = useInvalidateByKey("certificate");
  const { mutate: rejectCertificate, isPending } = useCertificatesReject();

  const handleReject = () => {
    rejectCertificate(id, {
      onSuccess: () => {
        toast.success(
          t("common.updateSuccess", {
            itemName: t("certificates.certificateName"),
          })
        );
        invalidateCertificates();
        router.back();
      },
      onError: (error: unknown) => {
        const apiError = error as AxiosError<{
          message?: string;
          error?: string;
        }>;
        toast.error(
          apiError?.response?.data?.message ||
            apiError?.response?.data?.error ||
            t("certificates.rejectError")
        );
      },
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        if (!isPending) {
          router.back();
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            {t("certificates.rejectConfirmationTitle")}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            {t("certificates.rejectConfirmationDescription")}
          </p>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isPending}
          >
            {t("common.cancel")}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleReject}
            disabled={isPending}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("common.reject")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
