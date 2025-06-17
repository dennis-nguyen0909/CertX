import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Degree } from "@/models/degree";
import { useTranslation } from "react-i18next";

interface ViewDialogProps {
  open: boolean;
  onClose: () => void;
  degree: Degree;
}

export const ViewDialog: React.FC<ViewDialogProps> = ({
  open,
  onClose,
  degree,
}) => {
  const { t } = useTranslation();
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("degrees.viewDetail")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <div>
            <b>{t("degrees.nameStudent")}:</b> {degree.nameStudent}
          </div>
          <div>
            <b>{t("degrees.className")}:</b> {degree.className}
          </div>
          <div>
            <b>{t("degrees.department")}:</b> {degree.department}
          </div>
          <div>
            <b>{t("degrees.graduationYear")}:</b> {degree.graduationYear}
          </div>
          <div>
            <b>{t("degrees.diplomaNumber")}:</b> {degree.diplomaNumber}
          </div>
          <div>
            <b>{t("degrees.issueDate")}:</b> {degree.issueDate}
          </div>
          <div>
            <b>{t("degrees.status")}:</b> {degree.status}
          </div>
          <div>
            <b>{t("common.createdAt")}:</b> {degree.createdAt}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
