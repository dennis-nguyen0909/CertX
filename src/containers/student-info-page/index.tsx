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
  Eye,
  EyeOff,
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
import { useRouter, useSearchParams } from "next/navigation";
import { TransferDialog } from "./components/transfer-dialog";
import { format } from "date-fns";
import { useWalletTransactionsOfStudent } from "@/hooks/wallet/use-wallet-transactions-students";
import { DataTable } from "@/components/data-table";
import { usePaginationQuery } from "@/hooks/use-pagination-query";
import { useColumns } from "./use-columns";
import { useGuardRoute } from "@/hooks/use-guard-route";

// Import shadcn form components
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

// Update: validate mật khẩu > 6 ký tự
const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Vui lòng nhập mật khẩu cũ"),
    newPassword: z.string().min(6, "Mật khẩu mới phải có ít nhất 6 ký tự"),
    confirmPassword: z
      .string()
      .min(6, "Vui lòng nhập lại mật khẩu mới (ít nhất 6 ký tự)"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export default function StudentInfoPage() {
  const { t } = useTranslation();
  const { setPagination, ...pagination } = usePaginationQuery();
  useGuardRoute();
  const { data: student, isLoading } = useStudentDetail();
  const { data: transactionsOfStudent } = useWalletTransactionsOfStudent({
    page: pagination.pageIndex,
    size: pagination.pageSize,
  });
  const [open, setOpen] = useState(false);
  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
  });
  const columns = useColumns(t);

  const router = useRouter();
  const changePasswordMutation = useStudentChangePasswordMutation();

  const openDialogTransfer = useSearchParams().get("action") === "transfer";
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

  // Password visibility state
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
                  {format(student.birthDate, "dd/MM/yyyy")}
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
      {/* Wallet Management Section - Redesigned */}
      <div className="mt-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Wallet className="text-blue-500" size={28} />
          {t("studentCoin.walletManagement")}
        </h2>
        <div className="bg-gradient-to-br from-blue-50 via-white to-blue-50 rounded-2xl shadow-lg border border-blue-100 p-0 overflow-hidden">
          {/* Coin Balance Card */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-8 py-6 bg-gradient-to-r from-blue-100/80 via-white to-blue-100/80">
            <div className="flex items-center gap-3">
              <div className="bg-blue-400/20 rounded-full p-3 flex items-center justify-center">
                <Coins className="text-blue-500" size={32} />
              </div>
              <div>
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                  {t("studentCoin.stuCoin")}
                </div>
                <div className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  {loadingCoin ? (
                    <span className="w-24 h-7 rounded bg-gray-200 animate-pulse inline-block" />
                  ) : (
                    <span>
                      {countCoinStu?.stuCoin
                        ? Number(countCoinStu.stuCoin).toLocaleString(
                            undefined,
                            {
                              minimumFractionDigits: 1,
                              maximumFractionDigits: 1,
                            }
                          )
                        : 0}
                    </span>
                  )}
                  <span className="text-base text-blue-500 font-semibold">
                    STU
                  </span>
                </div>
              </div>
            </div>
            <Button
              className="mt-4 md:mt-0 shadow-md bg-gradient-to-r from-blue-400 to-blue-500 text-white font-semibold"
              onClick={() => {
                router.push("?action=transfer");
              }}
            >
              {t("studentCoin.exchangeCoin") || "Trao đổi Stu Coin"}
            </Button>
          </div>
          {/* Wallet Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-blue-100 bg-white">
            {/* Wallet Address */}
            <div className="flex flex-col items-start gap-2 px-8 py-6 border-b md:border-b-0 md:border-r border-blue-100">
              <div className="flex items-center gap-2 mb-1">
                <Wallet className="text-blue-500" size={20} />
                <span className="font-semibold text-gray-700">
                  {t("wallet.address") || "Địa chỉ ví"}
                </span>
              </div>
              <CopyableCell
                value={student?.walletAddress ?? ""}
                display={
                  <span className="text-gray-600 font-mono text-sm break-all">
                    {formatPublicKey(student?.walletAddress, 15)}
                  </span>
                }
                tooltipLabel={t("wallet.copyAddress")}
                iconSize={14}
                iconClassName="text-blue-400"
              />
            </div>
            {/* Public Key */}
            <div className="flex flex-col items-start gap-2 px-8 py-6 border-b md:border-b-0 md:border-r border-blue-100">
              <div className="flex items-center gap-2 mb-1">
                <KeySquare className="text-green-500" size={20} />
                <span className="font-semibold text-gray-700">Public Key</span>
              </div>
              <CopyableCell
                value={student?.publicKey ?? ""}
                display={
                  <span className="text-gray-600 font-mono text-sm break-all">
                    {formatPublicKey(student?.publicKey, 15)}
                  </span>
                }
                tooltipLabel={t("wallet.copyAddress")}
                iconSize={14}
                iconClassName="text-green-400"
              />
            </div>
            {/* Private Key */}
            <div className="flex flex-col items-start gap-2 px-8 py-6">
              <div className="flex items-center gap-2 mb-1">
                <KeyRound className="text-red-500" size={20} />
                <span className="font-semibold text-gray-700">Private Key</span>
              </div>
              <CopyableCell
                value={student?.privateKey ?? ""}
                display={
                  <span className="text-gray-600 font-mono text-sm break-all">
                    {formatPublicKey(student?.privateKey, 15)}
                  </span>
                }
                tooltipLabel={t("wallet.copyAddress")}
                iconSize={14}
                iconClassName="text-red-400"
              />
            </div>
          </div>
        </div>
      </div>
      {/* End Wallet Management Section */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t("student.changePassword") || "Đổi mật khẩu"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="oldPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <span className="flex items-center gap-2">
                        <KeyRound className="text-primary" size={16} />
                        {t("student.oldPassword") || "Mật khẩu cũ"}
                      </span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showOldPassword ? "text" : "password"}
                          {...field}
                        />
                        <button
                          type="button"
                          tabIndex={-1}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                          onClick={() => setShowOldPassword((v) => !v)}
                        >
                          {showOldPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <span className="flex items-center gap-2">
                        <KeyRound className="text-primary" size={16} />
                        {t("student.newPassword") || "Mật khẩu mới"}
                      </span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showNewPassword ? "text" : "password"}
                          {...field}
                        />
                        <button
                          type="button"
                          tabIndex={-1}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                          onClick={() => setShowNewPassword((v) => !v)}
                        >
                          {showNewPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <span className="flex items-center gap-2">
                        <KeyRound className="text-primary" size={16} />
                        {t("student.confirmPassword") || "Xác nhận mật khẩu"}
                      </span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          {...field}
                        />
                        <button
                          type="button"
                          tabIndex={-1}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                          onClick={() => setShowConfirmPassword((v) => !v)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  {t("common.cancel") || "Hủy"}
                </Button>
                <Button
                  type="submit"
                  disabled={changePasswordMutation.isPending}
                >
                  {changePasswordMutation.isPending
                    ? t("common.loading") || "Đang đổi..."
                    : t("common.submit") || "Đổi mật khẩu"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      {openDialogTransfer && (
        <TransferDialog
          open={openDialogTransfer}
          onOpenChange={() => router.back()}
        />
      )}
      <div className="rounded-md border min-w-[320px] sm:min-w-[900px] overflow-x-auto">
        <DataTable
          columns={columns}
          data={transactionsOfStudent?.items || []}
          listMeta={transactionsOfStudent?.meta}
          isLoading={isLoading}
          onPaginationChange={setPagination}
        />
      </div>
    </div>
  );
}
