"use client";

import React from "react";
import { Check, ChevronDown, Loader, X } from "lucide-react";

import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { Button } from "../ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

export type Option = {
  value: string;
  label: string;
};

type SingleSelectProps = {
  options: Option[];
  placeholder?: string;
  defaultValue?: Option | null;
  onChange?: (selected: Option | null) => void;
  onEndReached?: () => void;
  onSearch?: (search: string) => void;
  isLoading?: boolean;
  renderSelectedLabel?: (selected: Option) => React.ReactNode;
  showCheckbox?: boolean;
  className?: string;
  disabled?: boolean;
};

export function SingleSelect({
  options,
  placeholder = "Select option...",
  defaultValue = null,
  onChange,
  onEndReached,
  onSearch,
  isLoading = false,
  renderSelectedLabel = (selected) => selected.label,
  showCheckbox = true,
  className,
  disabled = false,
}: SingleSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const commandGroupRef = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Option | null>(defaultValue);
  const [inputValue, setInputValue] = React.useState("");
  const { t } = useTranslation();

  const handleUnselect = React.useCallback(() => {
    setSelected(null);
    onChange?.(null);
  }, [onChange]);

  const handleInputChange = React.useCallback(
    (value: string) => {
      setInputValue(value);
      onSearch?.(value);
    },
    [onSearch]
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (
          (e.key === "Delete" || e.key === "Backspace") &&
          input.value === ""
        ) {
          setSelected(null);
          onChange?.(null);
        }
        if (e.key === "Escape") {
          input.blur();
        }
      }
    },
    [onChange]
  );

  const handleScroll = React.useCallback(() => {
    const commandGroup = commandGroupRef.current;
    if (commandGroup) {
      const { scrollTop, scrollHeight, clientHeight } = commandGroup;
      if (scrollHeight - scrollTop <= clientHeight + 1) {
        onEndReached?.();
      }
    }
  }, [onEndReached]);

  const handleSelect = React.useCallback(
    (option: Option) => () => {
      setSelected(option);
      onChange?.(option);

      setOpen(false); // tắt dropdown sau khi select
    },
    [onChange]
  );

  const arrowOpen = React.useCallback(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <Command
      onKeyDown={handleKeyDown}
      className={`overflow-visible bg-transparent ${className}`}
      shouldFilter={false}
    >
      <div className="flex items-center gap-1 justify-between ">
        <div className="flex-1 group rounded-md border border-input px-2 py-2 text-sm focus-within:bg-neutral-10">
          <div className="flex">
            <div className="flex flex-wrap gap-1 w-full items-center">
              {selected ? (
                <Badge variant="secondary">
                  {renderSelectedLabel(selected)}
                  <button
                    className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleUnselect();
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={handleUnselect}
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </Badge>
              ) : null}
              <CommandPrimitive.Input
                ref={inputRef}
                value={inputValue}
                onValueChange={handleInputChange}
                onBlur={() => setOpen(false)}
                onFocus={() => setOpen(true)}
                placeholder={placeholder}
                className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
                disabled={disabled}
              />
            </div>
            <Button
              className="flex bg-transparent hover:bg-transparent p-0 border-none w-fit h-full "
              disabled={open || disabled}
              onClick={() => arrowOpen()}
            >
              <div
                className={`transition-transform duration-300 ${
                  open ? "rotate-180" : ""
                }`}
              >
                <ChevronDown className="h-5 w-5" />
              </div>
            </Button>
          </div>
        </div>
      </div>
      <div className="relative">
        <CommandList>
          {open ? (
            <div className="absolute top-4 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
              <CommandGroup
                ref={commandGroupRef}
                className="max-h-[200px] overflow-auto"
                onScroll={handleScroll}
              >
                {options?.length > 0 ? (
                  options.map((option) => {
                    const isSelected = selected?.value === option.value;
                    return (
                      <CommandItem
                        key={option.value}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onSelect={handleSelect(option)}
                        className={"cursor-pointer"}
                      >
                        {showCheckbox && (
                          <div
                            className={`flex items-center justify-center rounded-[4px] border-neutral-40 border-2 w-5 h-5 ${
                              isSelected ? "bg-primary border-primary" : ""
                            }`}
                          >
                            <Check
                              className={`${
                                isSelected ? "visible text-white" : "invisible"
                              }`}
                            />
                          </div>
                        )}
                        {option.label}
                        <div className="hidden">{option.value}</div>
                      </CommandItem>
                    );
                  })
                ) : (
                  <CommandItem>
                    <div className="flex items-center justify-center">
                      <p className="text-muted-foreground">
                        {t("common.noResultsFound")}
                      </p>
                    </div>
                  </CommandItem>
                )}
                {isLoading && (
                  <CommandItem
                    disabled
                    className="flex items-center justify-center"
                  >
                    <Loader className="h-5 w-5 animate-spin" />
                  </CommandItem>
                )}
              </CommandGroup>
            </div>
          ) : null}
        </CommandList>
      </div>
    </Command>
  );
}
