"use client";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { useClassUpdate } from "@/hooks/class/use-class-update";
import FormItem from "@/components/ui/form-item";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Class } from "@/models/class";

interface EditDialogProps {
  open: boolean;
  id: string;
  classData?: Class;
}

type FormData = {
  className: string;
};

export function EditDialog({ open, id, classData }: EditDialogProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: updateClass, isPending } = useClassUpdate();

  const formSchema = z.object({
    className: z.string().min(1, t("common.required")),
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      className: "",
    },
  });

  useEffect(() => {
    if (classData) {
      // Use passed class data
      form.setValue("className", classData.className || "");
    }
  }, [form, classData]);

  const handleSubmit = (data: FormData) => {
    updateClass(
      { id: parseInt(id), className: data.className },
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
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="className"
              render={({ field }) => (
                <FormItem
                  label={t("class.className")}
                  required
                  inputComponent={
                    <FormControl>
                      <Input
                        placeholder={t("class.classNamePlaceholder")}
                        {...field}
                      />
                    </FormControl>
                  }
                />
              )}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                className=""
                disabled={isPending}
                onClick={() => {
                  router.back();
                }}
              >
                {t("common.cancel")}
              </Button>
              <Button
                type="submit"
                className={
                  !form.formState.isValid
                    ? "bg-disabled-background hover:bg-disabled-background text-[#b3b3b3]"
                    : ""
                }
                disabled={isPending || !form.formState.isValid}
              >
                {isPending && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                {isPending ? t("common.saving") : t("common.save")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
