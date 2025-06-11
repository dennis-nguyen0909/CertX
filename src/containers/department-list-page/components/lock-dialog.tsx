"use client";

import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useOpenLockDepartment } from "@/hooks/permission/use-openlock-department";
import { toast } from "sonner";
import { CircleCheck } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

interface LockDialogProps {
  id: string;
  name: string;
  open: boolean;
  isLocked: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function LockDialog({
  id,
  name,
  open,
  isLocked,
  onClose,
  onSuccess,
}: LockDialogProps) {
  const { t } = useTranslation();
  const { mutate: lockDepartment, isPending } = useOpenLockDepartment();
  const queryClient = useQueryClient();
  const handleConfirm = () => {
    lockDepartment(
      { id: parseInt(id) },
      {
        onSuccess: () => {
          toast.success(t("common.success"), {
            description: isLocked
              ? t("department.unlockSuccess")
              : t("department.lockSuccess"),
            icon: <CircleCheck className="text-green-500 w-5 h-5" />,
          });
          queryClient.invalidateQueries({ queryKey: ["department-list"] });
          onSuccess();
          onClose();
        },
        onError: () => {
          toast.error(t("common.error"), {
            description: isLocked
              ? t("department.unlockError")
              : t("department.lockError"),
          });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isLocked ? t("department.unlockTitle") : t("department.lockTitle")}
          </DialogTitle>
          <DialogDescription>
            {isLocked
              ? t("department.unlockConfirmation", { name })
              : t("department.lockConfirmation", { name })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            {t("common.cancel")}
          </Button>
          <Button
            variant={isLocked ? "default" : "destructive"}
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending
              ? isLocked
                ? t("department.unlocking")
                : t("department.locking")
              : isLocked
              ? t("department.unlock")
              : t("department.lock")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
