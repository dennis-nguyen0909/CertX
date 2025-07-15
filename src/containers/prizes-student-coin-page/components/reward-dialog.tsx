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

interface RewardDialogProps {
  open: boolean;
  onClose: () => void;
  studentId: string;
  studentName: string;
  currentCoin: string;
}

const RewardDialog: React.FC<RewardDialogProps> = ({
  open,
  onClose,
  studentName,
  currentCoin,
}) => {
  const { t } = useTranslation();
  const maxCoin = Number.parseInt(currentCoin) || 0;
  const [amount, setAmount] = useState<number | undefined>(maxCoin);
  const [error, setError] = useState<string | null>(null);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let valueStr = e.target.value;

    // Remove leading zeros
    valueStr = valueStr.replace(/^0+(\d)/, "$1");

    // If input is empty, set amount to undefined
    if (valueStr === "") {
      setAmount(undefined);
      setError(
        t("studentCoin.amountMin", { min: 1 }) || "Số lượng phải lớn hơn 0"
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
    } else if (value < 1) {
      setError(
        t("studentCoin.amountMin", { min: 1 }) || "Số lượng phải lớn hơn 0"
      );
    } else {
      setError(null);
    }
  };

  const handleReward = async () => {
    if (!amount || amount < 1 || amount > maxCoin) {
      setError(
        amount && amount > maxCoin
          ? t("studentCoin.amountExceeds", { max: maxCoin }) ||
              "Số lượng vượt quá số coin hiện có"
          : t("studentCoin.amountMin", { min: 1 }) || "Số lượng phải lớn hơn 0"
      );
      return;
    }
    // TODO: handle reward logic here
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>
            {t("studentCoin.rewardTitle", { name: studentName })}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <label className="font-medium">{t("studentCoin.enterAmount")}</label>
          <Input
            type="number"
            min={1}
            max={maxCoin}
            value={amount === undefined ? "" : amount}
            onChange={handleAmountChange}
            placeholder={t("studentCoin.amountPlaceholder")}
            inputMode="numeric"
            pattern="[0-9]*"
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
            disabled={!amount || amount < 1 || amount > maxCoin || !!error}
          >
            {t("studentCoin.reward")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RewardDialog;
