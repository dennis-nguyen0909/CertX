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
import { useDegreeReject } from "@/hooks/degree/use-degree-reject";
import { isAxiosError } from "axios";
import { useInvalidateByKey } from "@/hooks/use-invalidate-by-key";

interface RejectDialogProps {
  open: boolean;
  id: number;
}

export function RejectDialog({ open, id }: RejectDialogProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const updateQuery = useInvalidateByKey("degree");
  const { mutate: rejectDegree, isPending, error } = useDegreeReject();

  const handleReject = () => {
    rejectDegree(id, {
      onSuccess: () => {
        updateQuery();
        router.back();
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
            {t("degrees.rejectConfirmationTitle")}
          </DialogTitle>
        </DialogHeader>
        <div className="py-2">
          <p className="text-sm text-muted-foreground">
            {t("degrees.rejectConfirmationDescription")}
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
        {isAxiosError(error) && (
          <p className="text-sm text-red-500">{error.response?.data.message}</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
