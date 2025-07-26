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
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useInvalidateByKey } from "@/hooks/use-invalidate-by-key";
import { useUpdateDegreeTitle } from "@/hooks/degree/use-update-degree-title";
import { isAxiosError } from "axios";

interface EditDegreeTitleDialogProps {
  open: boolean;
  id: string;
  name: string;
}

export function EditDegreeTitleDialog({
  open,
  id,
  name,
}: EditDegreeTitleDialogProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const invalidateDegreeTitle = useInvalidateByKey("degree-title-list");
  const [degreeTitleName, setDegreeTitleName] = useState(name);
  const {
    mutate: updateDegreeTitle,
    isPending,
    error,
  } = useUpdateDegreeTitle();

  useEffect(() => {
    setDegreeTitleName(name);
  }, [name, id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateDegreeTitle(
      { id: parseInt(id), name: degreeTitleName },
      {
        onSuccess: () => {
          invalidateDegreeTitle();
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t("degrees.degreeTitleName")}</Label>
            <Input
              id="name"
              value={degreeTitleName}
              onChange={(e) => setDegreeTitleName(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("common.saving")}
                </>
              ) : (
                t("common.save")
              )}
            </Button>
          </div>
        </form>
        {isAxiosError(error) && (
          <p className="text-sm text-red-500">{error.response?.data.message}</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
