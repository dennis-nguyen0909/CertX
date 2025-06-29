"use client";

import React from "react";
import { Check, Loader, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import Image from "next/image";
import { Button } from "../ui/button";

export type Option = {
  value: string | number;
  label: string;
};

type MultiSelectProps = {
  options: Option[];
  placeholder?: string;
  defaultValue?: Option[];
  onChange?: (selected: Option[]) => void;
  onEndReached?: () => void;
  onSearch?: (search: string) => void;
  isLoading?: boolean;
  renderSelectedLabel?: (selected: Option) => React.ReactNode;
};

export function MultiSelect({
  options,
  placeholder = "Select options...",
  defaultValue = [],
  onChange,
  onEndReached,
  onSearch,
  isLoading = false,
  renderSelectedLabel = (selected) => selected.label,
}: MultiSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const commandGroupRef = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Option[]>(defaultValue);
  const [inputValue, setInputValue] = React.useState("");

  const handleUnselect = React.useCallback(
    (option: Option) => {
      const newSelected = selected.filter((s) => s.value !== option.value);
      setSelected(newSelected);
      onChange?.(newSelected);
    },
    [onChange, selected]
  );

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
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "") {
            const newSelected = selected.slice(0, -1);
            setSelected(newSelected);
            onChange?.(newSelected);
          }
        }
        if (e.key === "Escape") {
          input.blur();
        }
      }
    },
    [onChange, selected]
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

  const selectedSet = React.useMemo(
    () => new Set(selected.map((option) => option.value)),
    [selected]
  );

  const handleSelect = React.useCallback(
    (option: Option) => () => {
      const newSelected = [...selected];
      if (selectedSet.has(option.value)) {
        newSelected.splice(
          newSelected.findIndex((s) => s.value === option.value),
          1
        );
      } else {
        newSelected.push(option);
      }
      setSelected(newSelected);
      onChange?.(newSelected);
    },
    [onChange, selected, selectedSet]
  );
  const arrowOpen = React.useCallback(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <Command
      onKeyDown={handleKeyDown}
      className="overflow-visible bg-transparent"
      shouldFilter={false}
    >
      <div className="flex items-center gap-1 justify-between ">
        <div className="flex-1 group rounded-md border border-input px-2 py-2 text-sm focus-within:bg-neutral-10">
          <div className="flex">
            <div className="flex flex-wrap gap-1 w-full items-center">
              {selected.map((option) => {
                return (
                  <Badge key={option.value} variant="secondary">
                    {renderSelectedLabel(option)}
                    <button
                      className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleUnselect(option);
                        }
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onClick={() => handleUnselect(option)}
                    >
                      <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    </button>
                  </Badge>
                );
              })}
              <CommandPrimitive.Input
                ref={inputRef}
                value={inputValue}
                onValueChange={handleInputChange}
                onBlur={() => setOpen(false)}
                onFocus={() => setOpen(true)}
                placeholder={placeholder}
                className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
              />
            </div>
            <Button
              className="flex bg-transparent hover:bg-transparent p-0 border-none w-fit h-full "
              disabled={open}
              onClick={() => arrowOpen()}
            >
              <div
                className={`transition-transform duration-300 ${
                  open ? "rotate-180" : ""
                }`}
              >
                <Image
                  src="/svgs/Chevron-down.svg"
                  alt="arrow-down"
                  width={20}
                  height={20}
                />
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
                {options.map((option) => {
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
                      <div
                        className={`flex items-center justify-center rounded-[4px] border-neutral-40 border-2 w-5 h-5 ${
                          selectedSet.has(option.value)
                            ? "bg-primary border-primary"
                            : ""
                        }`}
                      >
                        <Check
                          className={`${
                            selectedSet.has(option.value)
                              ? "visible text-primary-foreground"
                              : "invisible"
                          }`}
                        />
                      </div>
                      {option.label}
                      <div className="hidden">{option.value}</div>
                    </CommandItem>
                  );
                })}
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
