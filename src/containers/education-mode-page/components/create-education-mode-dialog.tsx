"use client";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useState } from "react";
import FormItem from "@/components/ui/form-item";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { isAxiosError } from "axios";
import { useCreateEducationMode } from "@/hooks/education-mode/use-create-education-mode";

const formSchema = z.object({
  name: z.string().min(1, { message: "degrees.educationModeNameRequired" }),
});

export function CreateEducationModeDialog() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const {
    mutateAsync: createEducationMode,
    status,
    error,
  } = useCreateEducationMode();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await createEducationMode(values.name);
    toast.success(t("common.createSuccess"));
    form.reset();
    setOpen(false);
    queryClient.invalidateQueries({ queryKey: ["education-mode-list"] });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">
          <Plus className="mr-2 h-4 w-4" />
          {t("common.create")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("degrees.createEducationMode")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem
                  label={t("degrees.educationModeName")}
                  required
                  inputComponent={
                    <FormControl>
                      <Input
                        placeholder={t("degrees.educationModeName")}
                        {...field}
                      />
                    </FormControl>
                  }
                />
              )}
            />
            {isAxiosError(error) && (
              <p className="text-sm text-red-500">
                {error.response?.data.message}
              </p>
            )}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={status === "pending"}
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
                disabled={status === "pending" || !form.formState.isValid}
              >
                {status === "pending" && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {!form.formState.isValid
                  ? t("common.addNew")
                  : t("common.addNew")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
