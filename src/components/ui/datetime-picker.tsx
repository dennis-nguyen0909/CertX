"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLocale } from "@/components/translations-provider";
import { useTranslation } from "react-i18next";
import { enUS, vi } from "date-fns/locale";
import type { Locale } from "date-fns";

export interface DateTimePickerProps {
  value?: Date;
  onChange?: (date?: Date) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}

export function DateTimePicker({
  value,
  onChange,
  placeholder,
  label,
  className,
}: DateTimePickerProps) {
  const { locale } = useLocale();
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);

  const localeMap: Record<string, Locale> = { en: enUS, vi };

  return (
    <div className={className}>
      {label && <div className="mb-1 text-sm font-medium">{label}</div>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            data-empty={!value}
            className="data-[empty=true]:text-muted-foreground  justify-start text-left font-normal w-full"
          >
            <CalendarIcon />
            {value
              ? format(value, "dd/MM/yyyy", { locale: localeMap[locale] })
              : placeholder || t("common.selectDate", "Pick a date")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={value}
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
