import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useCallback, useState } from "react";
import { useTransferCoinStudent } from "@/hooks/stu-coin/use-transfer-coin-student";
import { useWalletInfoCoinStudent } from "@/hooks/wallet/use-wallet-info-coin-student";
import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";

interface TransferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TransferDialog({ open, onOpenChange }: TransferDialogProps) {
  const { t } = useTranslation();
  // Get current stucoin balance
  const { data: walletInfo, isPending: loadingWallet } =
    useWalletInfoCoinStudent();
  const [error, setError] = useState<string>("");
  const stuCoinBalance = useMemo(() => {
    return walletInfo && walletInfo.stuCoin
      ? Number.parseFloat(walletInfo.stuCoin)
      : 0;
  }, [walletInfo]);
  const queryClient = useQueryClient();
  // Define schema with dynamic max and min 0.5
  const transferSchema = useMemo(
    () =>
      z.object({
        toAddress: z.string().min(1, t("common.required") || "is required"),
        amount: z
          .number({
            invalid_type_error:
              t("studentCoin.amount") +
              " " +
              (t("common.mustBeNumber") || "must be a number"),
          })
          .min(
            0.5,
            t("studentCoin.amount") +
              " " +
              (t("common.min") || "must be at least 0.5")
          )
          .max(
            stuCoinBalance,
            t("studentCoin.amount") +
              " " +
              t("common.max") +
              " " +
              stuCoinBalance
          ),
      }),
    [stuCoinBalance, t]
  );

  type TransferFormData = z.infer<typeof transferSchema>;

  const form = useForm<TransferFormData>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      toAddress: "",
      amount: 0.5,
    },
  });

  const transferMutation = useTransferCoinStudent();

  useEffect(() => {
    if (!open) {
      form.reset();
      transferMutation.reset();
    }
  }, [open]); // eslint-disable-line

  // If balance changes, update max validation
  useEffect(() => {
    form.trigger("amount");
  }, [stuCoinBalance]); // eslint-disable-line

  // Prevent closing dialog while loading
  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if ((transferMutation.isPending || loadingWallet) && nextOpen === false) {
        // Prevent closing while loading
        return;
      }
      onOpenChange(nextOpen);
    },
    [onOpenChange, transferMutation.isPending, loadingWallet]
  );

  const onSubmit = (data: TransferFormData) => {
    transferMutation.mutate(
      {
        toAddress: data.toAddress,
        amount: data.amount,
      },
      {
        onSuccess: () => {
          toast.success(
            t("studentCoin.transferSuccess") || "Transfer successful!"
          );
          queryClient.invalidateQueries({
            queryKey: ["wallet-info-coin-student"],
          });
          onOpenChange(false);
        },
        onError: (error) => {
          if (isAxiosError(error)) {
            setError(error.response?.data.message);
          }
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t("studentCoin.transferToken") || "Transfer Token"}
          </DialogTitle>
        </DialogHeader>
        <form className="space-y-4 mt-2" onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <label className="block mb-1 font-medium">
              {t("studentCoin.toAddress") || "Recipient Address"}
            </label>
            <Input
              {...form.register("toAddress")}
              placeholder={
                t("studentCoin.toAddressPlaceholder") ||
                "Enter recipient address"
              }
              disabled={transferMutation.isPending}
            />
            {form.formState.errors.toAddress && (
              <div className="text-red-500 text-sm mt-1">
                {form.formState.errors.toAddress.message}
              </div>
            )}
          </div>
          <div>
            <label className="block mb-1 font-medium flex items-center gap-2">
              {t("studentCoin.amount") || "Amount"}
              <span className="text-xs text-gray-500">
                {loadingWallet
                  ? `(${t("common.loading") || "Loading"}...)`
                  : `(Min: 0.5, Max: ${stuCoinBalance})`}
              </span>
            </label>
            <Input
              type="number"
              min={0.5}
              step={0.1}
              {...form.register("amount", { valueAsNumber: true })}
              placeholder={t("studentCoin.amountPlaceholder") || "Enter amount"}
              disabled={transferMutation.isPending || loadingWallet}
            />
            {form.formState.errors.amount && (
              <div className="text-red-500 text-sm mt-1">
                {form.formState.errors.amount.message}
              </div>
            )}{" "}
            {error && <p className="text-sm text-red-500 mt-5">{error}</p>}
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={transferMutation.isPending || loadingWallet}
            >
              {t("common.cancel") || "Cancel"}
            </Button>
            <Button
              type="submit"
              disabled={
                transferMutation.isPending ||
                loadingWallet ||
                stuCoinBalance < 0.5
              }
            >
              {transferMutation.isPending
                ? t("common.loading") || "Transferring..."
                : t("studentCoin.transfer") || "Transfer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
