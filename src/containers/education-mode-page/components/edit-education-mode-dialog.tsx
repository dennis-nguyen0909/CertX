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
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { useUpdateEducationMode } from "@/hooks/education-mode/use-update-education-mode";

interface EditEducationModeDialogProps {
  open: boolean;
  id: string;
  name: string;
}

export function EditEducationModeDialog({
  open,
  id,
  name,
}: EditEducationModeDialogProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const invalidateEducationMode = useInvalidateByKey("education-mode-list");
  const [educationModeName, setEducationModeName] = useState(name);
  const {
    mutate: updateEducationMode,
    isPending,
    error,
  } = useUpdateEducationMode();

  useEffect(() => {
    setEducationModeName(name);
  }, [name, id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateEducationMode(
      { id: parseInt(id), name: educationModeName },
      {
        onSuccess: () => {
          invalidateEducationMode();
          router.back();
        },
        onError: (err) => {
          toast.error(
            isAxiosError(err) && err.response?.data?.message
              ? err.response.data.message
              : t("degrees.updateEducationModeFailed")
          );
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
            <Label htmlFor="name">{t("degrees.educationModeName")}</Label>
            <Input
              id="name"
              value={educationModeName}
              onChange={(e) => setEducationModeName(e.target.value)}
              required
            />
          </div>
          {isAxiosError(error) && (
            <p className="text-sm text-red-500">
              {error.response?.data.message}
            </p>
          )}
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
      </DialogContent>
    </Dialog>
  );
}
