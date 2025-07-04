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
import FormItem from "@/components/ui/form-item";
import { useQueryClient } from "@tanstack/react-query";
import { useChangePasswordDepartment } from "@/hooks/user/use-change-password-department";
import { z } from "zod";
import { toast } from "sonner";

const changePasswordSchema = (t: (key: string) => string) =>
  z
    .object({
      passwordUniversity: z.string().min(1, t("common.required")),
      newPassword: z.string().min(6, t("common.passwordMinLength")),
      confirmPassword: z.string().min(1, t("common.required")),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t("common.passwordsDoNotMatch"),
      path: ["confirmPassword"],
    });

type ChangePasswordFormData = z.infer<ReturnType<typeof changePasswordSchema>>;

interface ChangePasswordDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  departmentId?: number;
  departmentName?: string;
}

export function ChangePasswordDialog({
  isOpen,
  onOpenChange,
  departmentId,
  departmentName,
}: ChangePasswordDialogProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const {
    mutate: changePassword,
    isPending,
    error,
  } = useChangePasswordDepartment();

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema(t)),
    defaultValues: {
      passwordUniversity: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (data: ChangePasswordFormData) => {
    if (!departmentId) return;

    await changePassword(
      {
        id: departmentId,
        passwordUniversity: data.passwordUniversity,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      },
      {
        onSuccess: () => {
          form.reset();
          onOpenChange(false);
          queryClient.invalidateQueries({ queryKey: ["user-department-list"] });
          toast.success(
            t("common.updateSuccess", { itemName: t("department.name") })
          );
        },
      }
    );
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t("department.changePassword")} - {departmentName}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="passwordUniversity"
              render={({ field }) => (
                <FormItem
                  label={t("department.universityPassword")}
                  required
                  inputComponent={
                    <>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder={t(
                            "department.universityPasswordPlaceholder"
                          )}
                          {...field}
                        />
                      </FormControl>
                      {form.formState.errors.passwordUniversity && (
                        <div className="text-xs text-red-500 mt-1">
                          {form.formState.errors.passwordUniversity.message?.toString()}
                        </div>
                      )}
                      <div className="text-xs text-gray-400 italic mt-1">
                        {t("department.passwordRequiredNote")}
                      </div>
                    </>
                  }
                />
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem
                  label={t("department.newPassword")}
                  required
                  inputComponent={
                    <>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder={t("department.newPasswordPlaceholder")}
                          {...field}
                        />
                      </FormControl>
                      {form.formState.errors.newPassword && (
                        <div className="text-xs text-red-500 mt-1">
                          {form.formState.errors.newPassword.message?.toString()}
                        </div>
                      )}
                      <div className="text-xs text-gray-400 italic mt-1">
                        {t("department.passwordMinLengthNote", { min: 6 })}
                      </div>
                    </>
                  }
                />
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem
                  label={t("department.confirmPassword")}
                  required
                  inputComponent={
                    <>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder={t(
                            "department.confirmPasswordPlaceholder"
                          )}
                          {...field}
                        />
                      </FormControl>
                      {form.formState.errors.confirmPassword && (
                        <div className="text-xs text-red-500 mt-1">
                          {form.formState.errors.confirmPassword.message?.toString()}
                        </div>
                      )}
                      <div className="text-xs text-gray-400 italic mt-1">
                        {t("department.confirmPasswordNote")}
                      </div>
                    </>
                  }
                />
              )}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                className="border-[#EE5123] text-[#EE5123] hover:bg-transparent hover:text-[#EE5123] w-[100px]"
                disabled={isPending}
                onClick={handleClose}
              >
                {t("common.cancel")}
              </Button>
              <Button
                type="submit"
                className={
                  !form.formState.isValid
                    ? "bg-disabled-background hover:bg-disabled-background text-[#b3b3b3] w-[100px]"
                    : " w-[100px]"
                }
                disabled={isPending}
              >
                {isPending && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                {t("common.submit")}
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
