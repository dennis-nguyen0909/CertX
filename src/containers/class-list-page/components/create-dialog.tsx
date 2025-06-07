"use client";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader, ChevronsUpDown, Check } from "lucide-react";
import { useClassCreate } from "@/hooks/class/use-class-create";
import FormItem from "@/components/ui/form-item";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useUserDepartmentList } from "@/hooks/user/use-user-department-list";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandGroup,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type FormData = {
  id: string;
  className: string;
};

export function CreateDialog() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const queryClient = useQueryClient();
  const { mutate: createClass, isPending, error } = useClassCreate();

  // Department list state
  const [allDepartments, setAllDepartments] = useState<
    { id: number; name: string }[]
  >([]);

  const { data: departmentList, isLoading: isDepartmentLoading } =
    useUserDepartmentList({
      pageIndex: 0,
      pageSize: 2000,
    });

  console.log("duydeptrai123", allDepartments);

  // Update allDepartments when data arrives
  useEffect(() => {
    if (departmentList?.items) {
      console.log("🔄 Loading departments:", departmentList.items.length);
      setAllDepartments(
        departmentList.items.map((item) => ({ id: item.id, name: item.name }))
      );
    }
  }, [departmentList]);

  const formSchema = z.object({
    id: z.string().min(1, t("common.required")),
    className: z.string().min(1, t("common.required")),
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      className: "",
    },
  });

  const handleSubmit = (data: FormData) => {
    const submissionData = {
      id: data.id,
      className: data.className,
    };

    createClass(submissionData, {
      onSuccess: () => {
        form.reset();
        setOpen(false);
        // Invalidate and refetch the class list
        queryClient.invalidateQueries({ queryKey: ["class-list"] });
      },
    });
  };

  console.log("error", error);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{t("common.create")}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("class.create")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem
                  label={t("student.departmentName")}
                  required
                  inputComponent={
                    <FormControl>
                      <Popover
                        open={comboboxOpen}
                        onOpenChange={setComboboxOpen}
                      >
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={comboboxOpen}
                              className={cn(
                                "w-full justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? allDepartments.find(
                                    (d) => d.id.toString() === field.value
                                  )?.name
                                : t("student.departmentNamePlaceholder")}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[400px] p-0">
                          <Command
                            filter={(value, search) => {
                              const department = allDepartments.find(
                                (d) => d.id.toString() === value
                              );
                              if (!department) return 0;
                              if (
                                department.name
                                  .toLowerCase()
                                  .includes(search.toLowerCase())
                              ) {
                                return 1;
                              }
                              return 0;
                            }}
                          >
                            <CommandInput
                              placeholder={t(
                                "student.departmentNamePlaceholder"
                              )}
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty>
                                {t("common.noResults")}
                              </CommandEmpty>
                              {isDepartmentLoading ? (
                                <CommandItem disabled>
                                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                                  {t("common.loading")}
                                </CommandItem>
                              ) : (
                                <CommandGroup>
                                  {allDepartments.map((item) => (
                                    <CommandItem
                                      key={item.id}
                                      value={item.id.toString()}
                                      onSelect={() => {
                                        field.onChange(item.id.toString());
                                        setComboboxOpen(false);
                                      }}
                                    >
                                      {item.name}
                                      <Check
                                        className={cn(
                                          "ml-auto h-4 w-4",
                                          field.value === item.id.toString()
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              )}
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                  }
                />
              )}
            />
            <FormField
              control={form.control}
              name="className"
              render={({ field }) => (
                <FormItem
                  label={t("class.className")}
                  required
                  inputComponent={
                    <FormControl>
                      <Input
                        placeholder={t("class.classNamePlaceholder")}
                        {...field}
                      />
                    </FormControl>
                  }
                />
              )}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                className=""
                disabled={isPending}
                onClick={() => {
                  form.reset();
                  setOpen(false);
                }}
              >
                {t("common.cancel")}
              </Button>
              <Button
                type="submit"
                className={
                  !form.formState.isValid
                    ? "bg-disabled-background hover:bg-disabled-background text-[#b3b3b3]"
                    : ""
                }
                disabled={isPending || !form.formState.isValid}
              >
                {isPending && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                {!form.formState.isValid
                  ? t("common.addNew")
                  : t("common.submit")}
              </Button>
            </div>
            {error && (
              <div className="text-red-500 text-sm">
                {typeof error === "object" &&
                error !== null &&
                "response" in error
                  ? (error as { response: { data: { message: string } } })
                      .response.data.message
                  : t("common.errorOccurred")}
              </div>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
