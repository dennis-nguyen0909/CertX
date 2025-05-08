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
import { useCertificatesUpdate } from "@/hooks/certificates/use-certificates-update";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Certificate } from "@/models/certificates";

interface EditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  certificate?: Certificate;
}

export function EditDialog({
  isOpen,
  onOpenChange,
  certificate,
}: EditDialogProps) {
  const { t } = useTranslation();
  const [name, setName] = useState(certificate?.name || "");
  const [issuer, setIssuer] = useState(certificate?.issuer || "");
  const [issueDate, setIssueDate] = useState(certificate?.issueDate || "");
  const [expiryDate, setExpiryDate] = useState(certificate?.expiryDate || "");
  const [status, setStatus] = useState(certificate?.status || "active");
  const { mutate: updateCertificate, isPending } = useCertificatesUpdate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certificate) return;

    updateCertificate(
      {
        id: certificate.id,
        name,
        issuer,
        issueDate,
        expiryDate,
        status,
      },
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
          <DialogTitle>{t("certificates.edit")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t("certificates.name")}</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="issuer">{t("certificates.issuer")}</Label>
            <Input
              id="issuer"
              value={issuer}
              onChange={(e) => setIssuer(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="issueDate">{t("certificates.issueDate")}</Label>
            <Input
              id="issueDate"
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expiryDate">{t("certificates.expiryDate")}</Label>
            <Input
              id="expiryDate"
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">{t("certificates.status")}</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder={t("certificates.selectStatus")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">
                  {t("certificates.statusActive")}
                </SelectItem>
                <SelectItem value="expired">
                  {t("certificates.statusExpired")}
                </SelectItem>
                <SelectItem value="revoked">
                  {t("certificates.statusRevoked")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? t("common.saving") : t("common.save")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
