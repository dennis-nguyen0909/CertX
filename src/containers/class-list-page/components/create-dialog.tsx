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

type FormData = {
  id: string;
  className: string;
};

export function CreateDialog() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { mutate: createClass, isPending, error } = useClassCreate();

  const formSchema = z.object({
    id: z.string().min(1, t("common.required")),
    className: z.string().min(1, t("common.required")),
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      className: "",
    },
  });

  const handleSubmit = (data: FormData) => {
    const submissionData = {
      id: parseInt(data.id),
      className: data.className,
    };

    createClass(submissionData, {
      onSuccess: () => {
        form.reset();
        setOpen(false);
        // Invalidate and refetch the class list
        queryClient.invalidateQueries({ queryKey: ["class-list"] });
      },
    });
  };

  console.log("error", error);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{t("common.create")}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("class.create")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem
                  label={t("common.id")}
                  required
                  inputComponent={
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={t("class.idPlaceholder")}
                        {...field}
                      />
                    </FormControl>
                  }
                />
              )}
            />
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
                {!form.formState.isValid
                  ? t("common.addNew")
                  : t("common.submit")}
              </Button>
            </div>
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
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
