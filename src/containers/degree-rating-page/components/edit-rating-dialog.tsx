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
import { useUpdateRating } from "@/hooks/rating/use-update-rating";
import { isAxiosError } from "axios";

interface EditRatingDialogProps {
  open: boolean;
  id: string;
  name: string;
}

export function EditRatingDialog({ open, id, name }: EditRatingDialogProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const invalidateRating = useInvalidateByKey("rating");
  const [ratingName, setRatingName] = useState(name);
  const { mutate: updateRating, isPending, error } = useUpdateRating();

  useEffect(() => {
    setRatingName(name);
  }, [name, id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateRating(
      { id: parseInt(id), name: ratingName },
      {
        onSuccess: () => {
          invalidateRating();
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
            <Label htmlFor="name">{t("degrees.ratingName")}</Label>
            <Input
              id="name"
              value={ratingName}
              onChange={(e) => setRatingName(e.target.value)}
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
