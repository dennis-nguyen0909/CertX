"use client";
import {
  User,
  Mail,
  Calendar,
  GraduationCap,
  Users,
  School,
} from "lucide-react";
import { useStudentDetail } from "@/hooks/user/use-student-detail";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { z } from "zod";
import { useStudentChangePasswordMutation } from "@/hooks/auth/use-forgot-password-mutation";
import { toast } from "sonner";

const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Required"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export default function StudentInfoPage() {
  const { t } = useTranslation();
  const { data: student, isLoading } = useStudentDetail();
  const [open, setOpen] = useState(false);
  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
  });
  const changePasswordMutation = useStudentChangePasswordMutation();

  const handleSubmit = async (data: ChangePasswordFormData) => {
    changePasswordMutation.mutate(data, {
      onSuccess: () => {
        toast.success(
          t("common.updateSuccess", { itemName: t("student.infoTitle") })
        );
        setOpen(false);
        form.reset();
      },
      onError: (error) => {
        let msg = t("common.errorOccurred") || "Đổi mật khẩu thất bại";
        if (typeof error === "object" && error && "response" in error) {
          msg =
            (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message || msg;
        }
        toast.error(msg);
      },
    });
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          {t("student.infoTitle")}
        </h2>
        <Button variant="outline" onClick={() => setOpen(true)}>
          {t("student.changePassword") || "Đổi mật khẩu"}
        </Button>
      </div>
      {isLoading ? (
        <div className="text-center text-gray-500 py-10">
          {t("student.loading")}
        </div>
      ) : !student ? (
        <div className="text-center text-gray-500 py-10">
          {t("student.noData")}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm p-8 flex flex-col gap-5 border">
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-3 min-w-[220px]">
              <User className="text-primary" />
              <span className="font-medium text-gray-700">
                {t("student.name")}:
              </span>
              <span className="text-gray-900 font-semibold">
                {student.name}
              </span>
            </div>
            <div className="flex items-center gap-3 min-w-[180px]">
              <Users className="text-primary" />
              <span className="font-medium text-gray-700">
                {t("student.studentCode")}:
              </span>
              <span className="text-gray-900 font-semibold">
                {student.studentCode}
              </span>
            </div>
            <div className="flex items-center gap-3 min-w-[220px]">
              <Mail className="text-primary" />
              <span className="font-medium text-gray-700">
                {t("student.email")}:
              </span>
              <span className="text-gray-900 font-semibold">
                {student.email}
              </span>
            </div>
            <div className="flex items-center gap-3 min-w-[200px]">
              <Calendar className="text-primary" />
              <span className="font-medium text-gray-700">
                {t("student.birthDate")}:
              </span>
              <span className="text-gray-900 font-semibold">
                {student.birthDate}
              </span>
            </div>
            <div className="flex items-center gap-3 min-w-[140px]">
              <GraduationCap className="text-primary" />
              <span className="font-medium text-gray-700">
                {t("student.course")}:
              </span>
              <span className="text-gray-900 font-semibold">
                {student.course}
              </span>
            </div>
            <div className="flex items-center gap-3 min-w-[140px]">
              <Users className="text-primary" />
              <span className="font-medium text-gray-700">
                {t("student.className")}:
              </span>
              <span className="text-gray-900 font-semibold">
                {student.className} (ID: {student.classId})
              </span>
            </div>
            <div className="flex items-center gap-3 min-w-[220px]">
              <Users className="text-primary" />
              <span className="font-medium text-gray-700">
                {t("student.departmentName")}:
              </span>
              <span className="text-gray-900 font-semibold">
                {student.departmentName} (ID: {student.departmentId})
              </span>
            </div>
            <div className="flex items-center gap-3 min-w-[220px]">
              <School className="text-primary" />
              <span className="font-medium text-gray-700">
                {t("student.universityName")}:
              </span>
              <span className="text-gray-900 font-semibold">
                {student.universityName}
              </span>
            </div>
          </div>
        </div>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t("student.changePassword") || "Đổi mật khẩu"}
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div>
              <label className="block mb-1 font-medium">
                {t("student.oldPassword") || "Mật khẩu cũ"}
              </label>
              <Input type="password" {...form.register("oldPassword")} />
              {form.formState.errors.oldPassword && (
                <div className="text-red-500 text-sm mt-1">
                  {form.formState.errors.oldPassword.message}
                </div>
              )}
            </div>
            <div>
              <label className="block mb-1 font-medium">
                {t("student.newPassword") || "Mật khẩu mới"}
              </label>
              <Input type="password" {...form.register("newPassword")} />
              {form.formState.errors.newPassword && (
                <div className="text-red-500 text-sm mt-1">
                  {form.formState.errors.newPassword.message}
                </div>
              )}
            </div>
            <div>
              <label className="block mb-1 font-medium">
                {t("student.confirmPassword") || "Xác nhận mật khẩu"}
              </label>
              <Input type="password" {...form.register("confirmPassword")} />
              {form.formState.errors.confirmPassword && (
                <div className="text-red-500 text-sm mt-1">
                  {form.formState.errors.confirmPassword.message}
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                {t("common.cancel") || "Hủy"}
              </Button>
              <Button type="submit" disabled={changePasswordMutation.isPending}>
                {changePasswordMutation.isPending
                  ? t("common.loading") || "Đang đổi..."
                  : t("common.submit") || "Đổi mật khẩu"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
