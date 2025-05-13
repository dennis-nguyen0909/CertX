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
import { useCertificatesTypeUpdate } from "@/hooks/certificates-type/use-certificates-type-update";
import { useRouter } from "next/navigation";

interface EditDialogProps {
  open: boolean;
  id: string;
}

export function EditDialog({ open, id }: EditDialogProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [name, setName] = useState("");
  const { mutate: updateCertificateType, isPending } =
    useCertificatesTypeUpdate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updateCertificateType(
      { id: parseInt(id), name },
      {
        onSuccess: () => {
          router.back();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={() => router.back()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("common.edit")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t("certificatesType.name")}</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
