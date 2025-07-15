"use client";
import {
  User,
  Mail,
  Calendar,
  GraduationCap,
  Users,
  School,
  Wallet,
  KeyRound,
  KeySquare,
  Coins,
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
import { CopyableCell } from "@/components/ui/copyable-cell";
import { formatPublicKey } from "@/utils/text";
import { useWalletInfoCoinStudent } from "@/hooks/wallet/use-wallet-info-coin-student";

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

  const { data: countCoinStu, isPending: loadingCoin } =
    useWalletInfoCoinStudent();

  return (
    <div className="max-w-5xl mx-auto mt-5 px-4">
      <div className="flex items-center justify-between mb-5">
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
        <div className="text-center text-gray-500 mt-5">
          {t("student.noData")}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm p-8 flex flex-col gap-5 border">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg shadow-sm">
              <User className="text-primary" />
              <div>
                <div className="text-xs text-gray-500">{t("student.name")}</div>
                <div className="text-gray-900 font-semibold">
                  {student.name}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg shadow-sm">
              <Users className="text-primary" />
              <div>
                <div className="text-xs text-gray-500">
                  {t("student.studentCode")}
                </div>
                <div className="text-gray-900 font-semibold">
                  {student.studentCode}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg shadow-sm">
              <Mail className="text-primary" />
              <div>
                <div className="text-xs text-gray-500">
                  {t("student.email")}
                </div>
                <div className="text-gray-900 font-semibold">
                  {student.email}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg shadow-sm">
              <Calendar className="text-primary" />
              <div>
                <div className="text-xs text-gray-500">
                  {t("student.birthDate")}
                </div>
                <div className="text-gray-900 font-semibold">
                  {student.birthDate}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg shadow-sm">
              <GraduationCap className="text-primary" />
              <div>
                <div className="text-xs text-gray-500">
                  {t("student.course")}
                </div>
                <div className="text-gray-900 font-semibold">
                  {student.course}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg shadow-sm">
              <Users className="text-primary" />
              <div>
                <div className="text-xs text-gray-500">
                  {t("student.className")}
                </div>
                <div className="text-gray-900 font-semibold">
                  {student.className}{" "}
                  <span className="text-xs text-gray-400">
                    (ID: {student.classId})
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg shadow-sm">
              <Users className="text-primary" />
              <div>
                <div className="text-xs text-gray-500">
                  {t("student.departmentName")}
                </div>
                <div className="text-gray-900 font-semibold">
                  {student.departmentName}{" "}
                  <span className="text-xs text-gray-400">
                    (ID: {student.departmentId})
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg shadow-sm">
              <School className="text-primary" />
              <div>
                <div className="text-xs text-gray-500">
                  {t("student.universityName")}
                </div>
                <div className="text-gray-900 font-semibold">
                  {student.universityName}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="mt-5">
        <h2 className="text-2xl font-bold text-gray-900">
          {t("studentCoin.walletManagement")}
        </h2>
        <div className="bg-white rounded-2xl p-8 shadow border mt-5">
          <div className="flex justify-start items-center gap-5 mb-4">
            <Coins className="text-yellow-500" size={20} />
            <span className="font-medium text-gray-700">
              {t("studentCoin.stuCoin")}
            </span>
            {loadingCoin ? (
              <span className="w-16 h-5 rounded bg-gray-200 animate-pulse inline-block" />
            ) : (
              <span>
                {countCoinStu?.stuCoin
                  ? Number(countCoinStu.stuCoin).toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })
                  : 0}
              </span>
            )}
          </div>
          <div className="flex justify-start items-center gap-5 mb-4">
            <Wallet className="text-blue-500" size={20} />
            <span className="font-medium text-gray-700">Địa chỉ ví</span>
            <CopyableCell
              value={student?.walletAddress ?? ""}
              display={
                <span className="text-gray-600 font-mono text-sm">
                  {formatPublicKey(student?.walletAddress, 15)}
                </span>
              }
              tooltipLabel={t("wallet.copyAddress")}
              iconSize={12}
              iconClassName="text-gray-400"
            />
          </div>
          <div className="flex justify-start items-center gap-5 mb-4">
            <KeySquare className="text-green-500" size={20} />
            <span className="font-medium text-gray-700">Public Key</span>
            <CopyableCell
              value={student?.publicKey ?? ""}
              display={
                <span className="text-gray-600 font-mono text-sm">
                  {formatPublicKey(student?.publicKey, 15)}
                </span>
              }
              tooltipLabel={t("wallet.copyAddress")}
              iconSize={12}
              iconClassName="text-gray-400"
            />
          </div>
          <div className="flex justify-start items-center gap-5 mb-4">
            <KeyRound className="text-red-500" size={20} />
            <span className="font-medium text-gray-700">Private Key</span>
            <CopyableCell
              value={student?.privateKey ?? ""}
              display={
                <span className="text-gray-600 font-mono text-sm">
                  {formatPublicKey(student?.privateKey, 15)}
                </span>
              }
              tooltipLabel={t("wallet.copyAddress")}
              iconSize={12}
              iconClassName="text-gray-400"
            />
          </div>
        </div>
      </div>
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
              <label className="block mb-1 font-medium flex items-center gap-2">
                <KeyRound className="text-primary" size={16} />
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
              <label className="block mb-1 font-medium flex items-center gap-2">
                <KeyRound className="text-primary" size={16} />
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
              <label className="block mb-1 font-medium flex items-center gap-2">
                <KeyRound className="text-primary" size={16} />
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
