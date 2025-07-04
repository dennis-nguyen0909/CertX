"use client";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { useClassCreate } from "@/hooks/class/use-class-create";
import FormItem from "@/components/ui/form-item";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

interface CreateDialogProps {
  departmentId: string;
}

type FormData = {
  className: string;
};

export function CreateDialog({ departmentId }: CreateDialogProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { mutate: createClass, isPending, error } = useClassCreate();

  const formSchema = z.object({
    className: z.string().min(1, t("class.validation.classNameRequired")),
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      className: "",
    },
  });

  const handleSubmit = (data: FormData) => {
    createClass(
      { id: departmentId, className: data.className },
      {
        onSuccess: () => {
          form.reset();
          setOpen(false);
          queryClient.invalidateQueries({ queryKey: ["class-of-department"] });
        },
      }
    );
  };

  const handleOpenClose = (open: boolean) => {
    if (!isPending) {
      setOpen(open);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenClose}>
      <DialogTrigger asChild>
        <Button>{t("common.create")}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{t("class.create")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
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
                  form.reset();
                  setOpen(false);
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
                {t("common.submit")}
              </Button>
              {error && (
                <div className="text-red-500 text-sm">
                  {typeof error === "object" &&
                  error !== null &&
                  "response" in error
                    ? (error as { response: { data: { message: string } } })
                        .response.data.message
                    : t("common.errorOccurred")}
                </div>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
