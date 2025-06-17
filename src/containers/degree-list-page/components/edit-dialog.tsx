import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Degree } from "@/models/degree";
import { useTranslation } from "react-i18next";

interface EditDialogProps {
  open: boolean;
  onClose: () => void;
  degree: Degree;
  onEdit: (data: Degree) => void;
}

export const EditDialog: React.FC<EditDialogProps> = ({
  open,
  onClose,
  degree,
  onEdit,
}) => {
  const { t } = useTranslation();
  const { register, handleSubmit, reset } = useForm<Degree>({
    defaultValues: degree,
  });

  const onSubmit = (data: Degree) => {
    onEdit(data);
    reset();
    onClose();
  };

  React.useEffect(() => {
    reset(degree);
  }, [degree, reset]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("degrees.edit")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            {...register("nameStudent", { required: true })}
            placeholder={t("degrees.nameStudent")}
          />
          <Input
            {...register("className", { required: true })}
            placeholder={t("degrees.className")}
          />
          <Input
            {...register("department", { required: true })}
            placeholder={t("degrees.department")}
          />
          <Input
            {...register("graduationYear", { required: true })}
            placeholder={t("degrees.graduationYear")}
          />
          <Input
            {...register("diplomaNumber", { required: true })}
            placeholder={t("degrees.diplomaNumber")}
          />
          <Input
            {...register("issueDate", { required: true })}
            placeholder={t("degrees.issueDate")}
            type="date"
          />
          <Input
            {...register("status", { required: true })}
            placeholder={t("degrees.status")}
          />
          <DialogFooter>
            <Button type="submit">{t("common.save")}</Button>
            <Button type="button" variant="ghost" onClick={onClose}>
              {t("common.cancel")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
