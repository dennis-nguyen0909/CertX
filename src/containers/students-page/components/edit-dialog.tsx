"use client";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useStudentsUpdate } from "@/hooks/students/use-students-update";

interface EditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  student?: {
    id: string;
    name: string;
    email: string;
  };
}

export function EditDialog({ isOpen, onOpenChange, student }: EditDialogProps) {
  const { t } = useTranslation();
  const [name, setName] = useState(student?.name || "");
  const [email, setEmail] = useState(student?.email || "");
  const { mutate: updateStudent, isPending } = useStudentsUpdate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!student) return;

    updateStudent(
      { id: student.id, name, email },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("students.edit")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t("students.name")}</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t("students.email")}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? t("common.saving") : t("common.save")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
