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
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { isAxiosError } from "axios";

interface RejectDialogProps {
  open: boolean;
  id: number;
}

export function RejectDialog({ open, id }: RejectDialogProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const invalidateCertificates = useInvalidateByKey("certificate");
  const {
    mutate: rejectCertificate,
    isPending,
    error,
  } = useCertificatesReject();
  const [note, setNote] = useState("");

  const handleReject = () => {
    rejectCertificate(
      {
        id,
        note,
      },
      {
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
      }
    );
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
        <div className="py-4 space-y-3">
          <p className="text-sm text-muted-foreground">
            {t("certificates.rejectConfirmationDescription")}
          </p>
          <div>
            <label
              htmlFor="reject-note"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("common.rejectNoteLabel")}
              <span className="ml-1 text-red-500 font-normal">
                ({t("common.requireShort")})
              </span>
            </label>
            <Textarea
              id="reject-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t("common.rejectNotePlaceholder")}
              rows={4}
              className="w-full"
              disabled={isPending}
              required
            />
          </div>
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
            disabled={isPending || !note.trim()}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("common.reject")}
          </Button>
        </DialogFooter>
        {isAxiosError(error) && (
          <p className="text-sm text-red-500">{error.response?.data.message}</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
