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
import { useCreateRating } from "@/hooks/rating/use-create-rating";
import { toast } from "sonner";
import { useState } from "react";
import FormItem from "@/components/ui/form-item";
import { useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { isAxiosError } from "axios";

const formSchema = z.object({
  name: z.string().min(1, { message: "degrees.ratingNameRequired" }),
});

export function CreateRatingDialog() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const {
    mutateAsync: createRating,
    status,
    error,
    isPending,
  } = useCreateRating();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await createRating(values.name);
    toast.success(t("common.createSuccess"));
    form.reset();
    setOpen(false);
    queryClient.invalidateQueries({ queryKey: ["rating-list"] });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        if (!isPending) {
          setOpen(!open);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant={"default"}>
          <Plus className="mr-2 h-4 w-4" />
          {t("common.create")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("degrees.createRating")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem
                  label={t("degrees.ratingName")}
                  required
                  inputComponent={
                    <FormControl>
                      <Input placeholder={t("degrees.ratingName")} {...field} />
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
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
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
