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
import { useClassUpdate } from "@/hooks/class/use-class-update";
import { useRouter } from "next/navigation";
import { useClassDetail } from "@/hooks/class/use-class-detail";
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

interface EditDialogProps {
  open: boolean;
  id: string;
}

export function EditDialog({ open, id }: EditDialogProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [className, setClassName] = useState("");
  const { mutate: updateClass, isPending } = useClassUpdate();

  const { mutate: getClass, isPending: isPendingGetClass } = useClassDetail();

  useEffect(() => {
    getClass(parseInt(id), {
      onSuccess: (data) => {
        console.log(data);
        setClassName(data?.className);
      },
    });
  }, [getClass, id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updateClass(
      { id: parseInt(id), className },
      {
        onSuccess: () => {
          // Invalidate and refetch the class list
          queryClient.invalidateQueries({
            queryKey: ["class-list"],
          });
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
        {isPendingGetClass ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="w-4 h-4 animate-spin" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="className">{t("class.className")}</Label>
              <Input
                id="className"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={isPending}>
              {isPending ? t("common.saving") : t("common.save")}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
