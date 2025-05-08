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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCertificatesCreate } from "@/hooks/certificates/use-certificates-create";

interface CreateDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateDialog({ isOpen, onOpenChange }: CreateDialogProps) {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [issuer, setIssuer] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [status, setStatus] = useState("active");
  const { mutate: createCertificate, isPending } = useCertificatesCreate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createCertificate(
      {
        name,
        issuer,
        issueDate,
        expiryDate,
        status,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          setName("");
          setIssuer("");
          setIssueDate("");
          setExpiryDate("");
          setStatus("active");
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("certificates.create")}</DialogTitle>
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
