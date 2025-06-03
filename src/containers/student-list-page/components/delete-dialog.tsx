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
import { useStudentDelete } from "@/hooks/student/use-student-delete";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, AlertTriangle } from "lucide-react";

interface DeleteDialogProps {
  open: boolean;
  id: string;
  name: string;
}

export function DeleteDialog({ open, id, name }: DeleteDialogProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: deleteStudent, isPending } = useStudentDelete();

  const handleDelete = () => {
    deleteStudent(id, {
      onSuccess: () => {
        // Invalidate and refetch the student list
        queryClient.invalidateQueries({ queryKey: ["student-list"] });
        router.back();
      },
      onError: (error) => {
        console.error("Error deleting student:", error);
        // You can add error handling here, e.g., show a toast notification
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
            <AlertTriangle className="h-5 w-5 text-destructive" />
            {t("student.deleteConfirmationTitle")}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            {t("student.deleteConfirmation", { studentName: name })}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {t("student.deleteConfirmationDescription")}
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
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
            className="cursor-pointer"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("common.delete")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
