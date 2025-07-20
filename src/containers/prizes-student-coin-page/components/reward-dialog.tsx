"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useExchangePaymentCoin } from "@/hooks/stu-coin/use-exchange-token";
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isAxiosError } from "axios";

interface RewardDialogProps {
  open: boolean;
  onClose: () => void;
  studentId: string;
  studentName: string;
  currentCoin: string;
}

const MIN_AMOUNT = 0.5;

const RewardDialog: React.FC<RewardDialogProps> = ({
  open,
  onClose,
  studentName,
  currentCoin,
  studentId,
}) => {
  const { t } = useTranslation();
  const maxCoin = Number.parseFloat(currentCoin) || 0;
  const [amount, setAmount] = useState<number | undefined>(maxCoin);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const {
    mutate: mutateExchangePayment,
    isPending: isLoadingExchange,
    error: errorExchange,
  } = useExchangePaymentCoin();

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let valueStr = e.target.value;

    // Remove leading zeros
    valueStr = valueStr.replace(/^0+(\d)/, "$1");

    // If input is empty, set amount to undefined
    if (valueStr === "") {
      setAmount(undefined);
      setError(
        t("studentCoin.amountMin", { min: MIN_AMOUNT }) ||
          "Số lượng phải lớn hơn 0"
      );
      return;
    }

    const value = Number(valueStr);

    setAmount(value);

    if (value > maxCoin) {
      setError(
        t("studentCoin.amountExceeds", {
          max: maxCoin,
        }) || "Số lượng vượt quá số coin hiện có"
      );
    } else if (value < MIN_AMOUNT) {
      setError(
        t("studentCoin.amountMin", { min: MIN_AMOUNT }) ||
          "Số lượng phải lớn hơn 0"
      );
    } else {
      setError(null);
    }
  };

  const handleReward = async () => {
    if (
      amount === undefined ||
      isNaN(amount) ||
      amount < MIN_AMOUNT ||
      amount > maxCoin
    ) {
      setError(
        amount && amount > maxCoin
          ? t("studentCoin.amountExceeds", { max: maxCoin }) ||
              "Số lượng vượt quá số coin hiện có"
          : t("studentCoin.amountMin", { min: MIN_AMOUNT }) ||
              "Số lượng phải lớn hơn 0"
      );
      return;
    }

    // Gọi API với id và amount
    mutateExchangePayment(
      {
        id: Number(studentId),
        amount,
      },
      {
        onSuccess: () => {
          toast.success("Đổi thành công");
          queryClient.invalidateQueries({
            queryKey: ["student-list-coin-khoa"],
          });
          onClose(); // Đóng dialog khi thành công
        },
      }
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v && !isLoadingExchange) onClose();
      }}
    >
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>
            {t("studentCoin.rewardTitle", { name: studentName })}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <label className="font-medium">{t("studentCoin.enterAmount")}</label>
          <Input
            type="number"
            min={MIN_AMOUNT}
            max={maxCoin}
            step="0.01"
            value={amount === undefined ? "" : amount}
            onChange={handleAmountChange}
            placeholder={t("studentCoin.amountPlaceholder")}
            inputMode="decimal"
            pattern="[0-9]*[.,]?[0-9]*"
          />
          {error && <span className="text-red-500 text-sm">{error}</span>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} type="button">
            {t("common.cancel")}
          </Button>
          <Button
            onClick={handleReward}
            type="button"
            disabled={
              isLoadingExchange ||
              amount === undefined ||
              isNaN(amount) ||
              amount < MIN_AMOUNT ||
              amount > maxCoin ||
              !!error
            }
          >
            {isLoadingExchange ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                {t("common.processing") || "Đang xử lý..."}
              </div>
            ) : (
              t("studentCoin.reward")
            )}
          </Button>
        </DialogFooter>
        {errorExchange && (
          <p className="text-red-500 text-sm mt-2">
            {isAxiosError(errorExchange)
              ? errorExchange.response?.data?.message ??
                t("studentCoin.exchangeFailed") ??
                "Giao dịch thất bại, vui lòng thử lại."
              : errorExchange.message}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RewardDialog;
