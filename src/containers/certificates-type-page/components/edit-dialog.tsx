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
import { useEffect, useState } from "react";
import { useCertificatesTypeUpdate } from "@/hooks/certificates-type/use-certificates-type-update";
import { useRouter } from "next/navigation";
import { useCertificatesTypeDetail } from "@/hooks/certificates-type/use-certificates-type-detail";
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isAxiosError } from "axios";

interface EditDialogProps {
  open: boolean;
  id: string;
}

export function EditDialog({ open, id }: EditDialogProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const {
    mutate: updateCertificateType,
    isPending,
    error,
  } = useCertificatesTypeUpdate();

  const { mutate: getCertificateType, isPending: isPendingGetCertificateType } =
    useCertificatesTypeDetail();

  useEffect(() => {
    getCertificateType(parseInt(id), {
      onSuccess: (data) => {
        setName(data?.name);
      },
    });
  }, [getCertificateType, id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updateCertificateType(
      { id: parseInt(id), name },
      {
        onSuccess: () => {
          // Invalidate and refetch the certificates type list
          toast.success(t("common.updateSuccess"));
          queryClient.invalidateQueries({
            queryKey: ["certificates-type-list"],
          });
          router.back();
        },
      }
    );
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("common.edit")}</DialogTitle>
        </DialogHeader>
        {isPendingGetCertificateType ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="w-4 h-4 animate-spin" />
          </div>
        ) : (
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
            {isAxiosError(error) && (
              <p className="text-red-500 text-sm">
                {error.response?.data.message}
              </p>
            )}
            <div className="flex justify-end">
              <Button type="submit" disabled={isPending}>
                {isPending ? t("common.saving") : t("common.save")}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
