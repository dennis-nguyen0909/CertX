import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTranslation } from "react-i18next";
interface NotificationDeleteProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
  itemName: string;
}

export const NotificationDelete = ({
  isOpen,
  onOpenChange,
  onConfirm,
  onCancel,
  itemName,
}: NotificationDeleteProps) => {
  const { t } = useTranslation();
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("common.deleteConfirmation", { itemName })}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("common.deleteConfirmationDescription", { itemName })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>
            {t("common.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {t("common.delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
