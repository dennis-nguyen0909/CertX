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
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField } from "@/components/ui/form";
import FormItem from "@/components/ui/form-item";
import {
  UpdateUserDepartmentData,
  updateUserDepartmentSchema,
} from "@/schemas/user/user.schema";
import { useUpdateDepartment } from "@/hooks/user/use-update-department";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface EditDialogProps {
  open: boolean;
  id: string;
}

export function EditDialog({ open, id }: EditDialogProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { mutate: updateDepartment, isPending } = useUpdateDepartment();
  const queryClient = useQueryClient();
  const form = useForm<UpdateUserDepartmentData>({
    resolver: zodResolver(updateUserDepartmentSchema(t)),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  useEffect(() => {
    // Get data from URL params instead of API call
    const name = searchParams.get("name") || "";
    const email = searchParams.get("email") || "";

    form.reset({
      name: decodeURIComponent(name),
      email: decodeURIComponent(email),
    });
  }, [searchParams, form]);

  const handleSubmit = async (data: UpdateUserDepartmentData) => {
    updateDepartment(
      {
        id: parseInt(id),
        ...data,
      },
      {
        onSuccess: () => {
          toast.success(t("department.updateSuccess"));
          queryClient.invalidateQueries({
            queryKey: ["user-department-list"],
          });
          router.back();
        },
        onError: (error: unknown) => {
          const apiError = error as {
            response?: { data?: { message?: string } };
          };
          toast.error(
            apiError?.response?.data?.message || t("department.updateError")
          );
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
      </DialogContent>
    </Dialog>
  );
}
