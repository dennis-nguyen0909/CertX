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
import { useInvalidateByKey } from "@/hooks/use-invalidate-by-key";
import { useDeleteDegree } from "@/hooks/degree/use-delete-degree";
import { isAxiosError } from "axios";
import { toast } from "sonner";

interface DeleteDialogProps {
  open: boolean;
  id: string;
  degreeName: string;
  studentName: string;
}

export function DeleteDialog({
  open,
  id,
  degreeName,
  studentName,
}: DeleteDialogProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useInvalidateByKey("degree");
  const { mutate: deleteDegree, isPending, error } = useDeleteDegree();

  const handleDelete = () => {
    deleteDegree(parseInt(id), {
      onSuccess: () => {
        queryClient();
        toast.success(t("common.deleteSuccess"));
        router.back();
      },
      onError: (error) => {
        console.error("Error deleting degree:", error);
      },
    });
  };

  const handleCancel = () => {
    router.back();
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
            {t("common.deleteConfirmationTitle")}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            {/* {t("common.deleteConfirmation", { itemName: certificateName })} */}
            Bạn có chắc muốn xóa bằng cấp <b>{degreeName}</b> của sinh viên{" "}
            <b>{studentName}</b>?
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {t("common.deleteConfirmationDescription", {
              itemName: degreeName,
            })}
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
        {isAxiosError(error) && (
          <p className="text-red-500 text-sm">{error.response?.data.message}</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
