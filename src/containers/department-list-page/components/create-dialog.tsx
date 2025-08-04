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
import FormItem from "@/components/ui/form-item";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useUserDepartmentCreate } from "@/hooks/user/use-user-department-create";
import { z, ZodType } from "zod";
import { toast } from "sonner";
import { isAxiosError } from "axios";

// Custom schema to ensure password > 6 characters
function getCreateUserDepartmentSchema(
  t: (key: string, defaultValue?: string) => string
): ZodType<{
  name: string;
  email: string;
  password: string;
}> {
  return z.object({
    name: z
      .string()
      .min(1, t("department.nameRequired", "Vui lòng nhập tên khoa")),
    email: z.string().email(t("common.emailInvalid", "Email không hợp lệ")),
    password: z
      .string()
      .min(
        6,
        t("department.passwordMin", "Mật khẩu phải lớn hơn hoặc bằng 6 ký tự")
      ),
  });
}

export function CreateDialog() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const {
    mutate: createDepartment,
    isPending,
    error,
  } = useUserDepartmentCreate();

  const form = useForm<{
    name: string;
    email: string;
    password: string;
  }>({
    resolver: zodResolver(
      getCreateUserDepartmentSchema(
        t as unknown as (key: string, defaultValue?: string) => string
      )
    ),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const handleSubmit = async (data: {
    name: string;
    email: string;
    password: string;
  }) => {
    await createDepartment(data, {
      onSuccess: () => {
        form.reset();
        setOpen(false);
        queryClient.invalidateQueries({ queryKey: ["user-department-list"] });
        toast.success(
          t("common.createSuccess", { itemName: t("department.name") })
        );
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{t("department.create")}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("department.create")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem
                  label={t("department.name")}
                  required
                  inputComponent={
                    <FormControl>
                      <Input
                        placeholder={t("department.namePlaceholder")}
                        {...field}
                      />
                    </FormControl>
                  }
                />
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem
                  label={t("common.email")}
                  required
                  inputComponent={
                    <FormControl>
                      <Input
                        type="email"
                        placeholder={t("common.emailPlaceholder")}
                        {...field}
                      />
                    </FormControl>
                  }
                />
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem
                  label={t("department.password")}
                  required
                  inputComponent={
                    <FormControl>
                      <Input
                        type="password"
                        placeholder={t("common.passwordPlaceholder")}
                        {...field}
                      />
                    </FormControl>
                  }
                />
              )}
            />
            {isAxiosError(error) && (
              <p className="text-red-500 text-sm">
                {error.response?.data.message}
              </p>
            )}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                className="border-[#EE5123] text-[#EE5123] hover:bg-transparent hover:text-[#EE5123]"
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
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
