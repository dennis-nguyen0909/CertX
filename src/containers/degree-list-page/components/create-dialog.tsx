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

interface CreateDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: Omit<Degree, "id" | "createdAt">) => void;
}

export const CreateDialog: React.FC<CreateDialogProps> = ({
  open,
  onClose,
  onCreate,
}) => {
  const { t } = useTranslation();
  const { register, handleSubmit, reset } =
    useForm<Omit<Degree, "id" | "createdAt">>();

  const onSubmit = (data: Omit<Degree, "id" | "createdAt">) => {
    onCreate(data);
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("degrees.create")}</DialogTitle>
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
            <Button type="submit">{t("common.create")}</Button>
            <Button type="button" variant="ghost" onClick={onClose}>
              {t("common.cancel")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
