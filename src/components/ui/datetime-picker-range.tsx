"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLocale } from "@/components/translations-provider";
import { useTranslation } from "react-i18next";
import { enUS, vi } from "date-fns/locale";
import type { Locale } from "date-fns";
import { format } from "date-fns";

export interface DateTimePickerRangeProps {
  value?: Date;
  onChange?: (date?: Date) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}

export function DateTimePickerRange({
  value,
  onChange,
  placeholder,
  label,
  className,
}: DateTimePickerRangeProps) {
  const { locale } = useLocale();
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const localeMap: Record<string, Locale> = { en: enUS, vi };
  return (
    <div className={className + " flex flex-col gap-3"}>
      {label && (
        <Label htmlFor="date" className="px-1">
          {label}
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-full justify-between font-normal"
          >
            {value
              ? format(value, "dd/MM/yyyy", { locale: localeMap[locale] })
              : placeholder || t("common.selectDate", "Select date")}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            captionLayout="dropdown"
            onSelect={(date) => {
              onChange?.(date);
              setOpen(false);
            }}
            locale={localeMap[locale]}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
