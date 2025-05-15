"use client";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField } from "@/components/ui/form";
import FormItem from "@/components/ui/form-item";
import {
  CreateUserDepartmentData,
  createUserDepartmentSchema,
} from "@/schemas/user/user.schema";
import { useUserDepartmentDetail } from "@/hooks/user/use-user-department-detail";
import { useUserDepartmentUpdate } from "@/hooks/user/use-user-department-update";

interface EditDialogProps {
  open: boolean;
  id: string;
}

export function EditDialog({ open, id }: EditDialogProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { mutate: updateDepartment, isPending } = useUserDepartmentUpdate();
  const { mutate: getDepartment, isPending: isPendingGetDepartment } =
    useUserDepartmentDetail();

  const form = useForm<CreateUserDepartmentData>({
    resolver: zodResolver(createUserDepartmentSchema(t)),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    getDepartment(parseInt(id), {
      onSuccess: (data) => {
        form.reset({
          name: data?.data.name || "",
          email: data?.data.email || "",
          password: "",
        });
      },
    });
  }, [getDepartment, id, form]);

  const handleSubmit = async (data: CreateUserDepartmentData) => {
    await updateDepartment(
      {
        id: parseInt(id),
        ...data,
      },
      {
        onSuccess: () => {
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
        {isPendingGetDepartment ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="w-4 h-4 animate-spin" />
          </div>
        ) : (
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
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="border-[#EE5123] text-[#EE5123] hover:bg-transparent hover:text-[#EE5123]"
                  disabled={isPending}
                  onClick={() => router.back()}
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
                  {isPending ? t("common.saving") : t("common.save")}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
