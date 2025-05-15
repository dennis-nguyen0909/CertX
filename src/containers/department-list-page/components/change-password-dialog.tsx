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
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField } from "@/components/ui/form";
import FormItem from "@/components/ui/form-item";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useChangePasswordDepartment } from "@/hooks/user/use-change-password-department";
import { toast } from "sonner";
import { CircleCheck } from "lucide-react";
import { z } from "zod";
import { TFunction } from "i18next";

interface ChangePasswordDialogProps {
  open: boolean;
  id: number;
  departmentName: string;
  closeChangePasswordDialog: () => void;
}

const changePasswordSchema = (t: TFunction) =>
  z.object({
    newPassword: z
      .string()
      .min(6, t("validation.passwordMinLength"))
      .max(50, t("validation.passwordMaxLength")),
  });

export function ChangePasswordDialog({
  open,
  id,
  departmentName,
  closeChangePasswordDialog,
}: ChangePasswordDialogProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: changePasswordDepartment, isPending } =
    useChangePasswordDepartment();

  const form = useForm({
    resolver: zodResolver(changePasswordSchema(t)),
    defaultValues: {
      newPassword: "",
    },
  });

  const handleSubmit = async (data: { newPassword: string }) => {
    await changePasswordDepartment(
      { id, newPassword: data.newPassword },
      {
        onSuccess: () => {
          toast.success(t("common.success"), {
            description: t("department.passwordChangeSuccess"),
            icon: <CircleCheck className="text-green-500 w-5 h-5" />,
          });
          closeChangePasswordDialog();
        },
      }
    );
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <Dialog open={open} onOpenChange={() => router.back()}>
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
              name="newPassword"
              render={({ field }) => (
                <FormItem
                  label={t("department.newPassword")}
                  required
                  inputComponent={
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder={t("department.newPasswordPlaceholder")}
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                          <span className="sr-only">
                            {showPassword
                              ? t("common.hidePassword")
                              : t("common.showPassword")}
                          </span>
                        </button>
                      </div>
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
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("common.saving")}
                  </>
                ) : (
                  t("common.save")
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
