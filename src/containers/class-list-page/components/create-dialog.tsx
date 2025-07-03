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
import { useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { DepartmentSelect } from "@/components/single-select";
import { toast } from "@/components/ui/use-toast";

type FormData = {
  departmentId: number;
  className: string;
};

export function CreateDialog() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { mutate: createClass, isPending, error } = useClassCreate();

  const formSchema = z.object({
    departmentId: z.number().min(1, t("class.validation.departmentRequired")),
    className: z.string().min(1, t("class.validation.classNameRequired")),
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      departmentId: 0,
      className: "",
    },
  });

  const options = useMemo(
    () =>
      queryClient.getQueryData(["class-list-options"])
        ? (queryClient.getQueryData(["class-list-options"]) as {
            value: string;
            label: string;
          }[])
        : [],
    [queryClient]
  );

  const handleSubmit = (data: FormData) => {
    const submissionData = {
      id: String(data.departmentId),
      className: data.className,
    };

    createClass(submissionData, {
      onSuccess: () => {
        toast({
          title: t("common.createSuccess", { itemName: t("class.className") }),
        });
        form.reset();
        setOpen(false);
        // Invalidate and refetch the class list
        queryClient.invalidateQueries({ queryKey: ["class-list"] });
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: t("common.error"),
          description: t("class.createError"),
        });
      },
    });
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
      <DialogContent className="sm:max-w-[600px]">
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
              name="departmentId"
              render={({ field }) => (
                <FormItem
                  label={t("class.departmentName")}
                  required
                  inputComponent={
                    <FormControl>
                      <DepartmentSelect
                        placeholder={t("class.departmentNamePlaceholder")}
                        defaultValue={
                          field.value
                            ? options.find(
                                (opt) => opt.value === String(field.value)
                              ) ?? null
                            : null
                        }
                        onChange={(value) => {
                          field.onChange(
                            value?.value ? Number(value.value) : 0
                          );
                        }}
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
