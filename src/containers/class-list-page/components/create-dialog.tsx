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
import { Loader } from "lucide-react";
import { useClassCreate } from "@/hooks/class/use-class-create";
import FormItem from "@/components/ui/form-item";
import { useState, useCallback, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useUserDepartmentList } from "@/hooks/user/use-user-department-list";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FormData = {
  id: string;
  className: string;
};

export function CreateDialog() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { mutate: createClass, isPending, error } = useClassCreate();

  // Infinite scroll state for departments
  const [currentDepartmentPage, setCurrentDepartmentPage] = useState(0);
  const [allDepartments, setAllDepartments] = useState<
    { id: number; name: string }[]
  >([]);
  const [hasDepartmentNextPage, setHasDepartmentNextPage] = useState(true);
  const [isDepartmentLoadingMore, setIsDepartmentLoadingMore] = useState(false);
  const [isDepartmentDropdownOpen, setIsDepartmentDropdownOpen] =
    useState(false);

  const { data: departmentList, isLoading: isDepartmentLoading } =
    useUserDepartmentList({
      pageIndex: currentDepartmentPage,
      pageSize: 10,
    });

  console.log("duydeptrai123", allDepartments);

  // Update allDepartments when new data arrives
  useEffect(() => {
    if (departmentList?.items) {
      console.log(
        "🔄 Loading department page:",
        currentDepartmentPage,
        "Items:",
        departmentList.items.length
      );
      if (currentDepartmentPage === 0) {
        setAllDepartments(
          departmentList.items.map((item) => ({ id: item.id, name: item.name }))
        );
      } else {
        setAllDepartments((prev) => {
          const newItems = departmentList.items.map((item) => ({
            id: item.id,
            name: item.name,
          }));
          // Remove duplicates by filtering out items that already exist
          const existingIds = new Set(prev.map((item) => item.id));
          const uniqueNewItems = newItems.filter(
            (item) => !existingIds.has(item.id)
          );
          const combined = [...prev, ...uniqueNewItems];
          console.log("📦 Total departments loaded:", combined.length);
          return combined;
        });
      }
      const hasMore = !!departmentList.meta?.nextPage;
      console.log("📄 Department has next page:", hasMore);
      setHasDepartmentNextPage(hasMore);
      setIsDepartmentLoadingMore(false);
    }
  }, [departmentList, currentDepartmentPage]);

  const loadMoreDepartments = useCallback(() => {
    console.log("🚀 Load more departments triggered", {
      isDepartmentLoadingMore,
      hasDepartmentNextPage,
      isDepartmentLoading,
      currentDepartmentPage,
      isDepartmentDropdownOpen,
    });
    if (
      !isDepartmentLoadingMore &&
      hasDepartmentNextPage &&
      !isDepartmentLoading &&
      isDepartmentDropdownOpen
    ) {
      console.log(
        "✅ Loading next department page:",
        currentDepartmentPage + 1
      );
      setIsDepartmentLoadingMore(true);
      setCurrentDepartmentPage((prev) => prev + 1);
    }
  }, [
    isDepartmentLoadingMore,
    hasDepartmentNextPage,
    isDepartmentLoading,
    currentDepartmentPage,
    isDepartmentDropdownOpen,
  ]);

  // Auto-load more departments when dropdown opens or when we have few items
  useEffect(() => {
    if (
      isDepartmentDropdownOpen &&
      allDepartments.length < 20 &&
      hasDepartmentNextPage &&
      !isDepartmentLoadingMore &&
      !isDepartmentLoading
    ) {
      console.log("🔄 Auto-loading more department items on dropdown open");
      setTimeout(() => {
        loadMoreDepartments();
      }, 200);
    }
  }, [
    isDepartmentDropdownOpen,
    allDepartments.length,
    hasDepartmentNextPage,
    isDepartmentLoadingMore,
    isDepartmentLoading,
    loadMoreDepartments,
  ]);

  const handleDepartmentScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const element = e.currentTarget;
      const { scrollTop, scrollHeight, clientHeight } = element;
      const isNearBottom = scrollHeight - scrollTop <= clientHeight + 20;

      console.log("📜 Department scroll event:", {
        scrollTop: Math.round(scrollTop),
        scrollHeight,
        clientHeight,
        remaining: Math.round(scrollHeight - scrollTop - clientHeight),
        isNearBottom,
        hasDepartmentNextPage,
        isDepartmentLoadingMore,
      });

      if (isNearBottom && hasDepartmentNextPage && !isDepartmentLoadingMore) {
        console.log("⬇️ Auto-loading more department items");
        loadMoreDepartments();
      }
    },
    [hasDepartmentNextPage, isDepartmentLoadingMore, loadMoreDepartments]
  );

  // Handle department dropdown open/close
  const handleDepartmentOpenChange = useCallback(
    (open: boolean) => {
      console.log("🔽 Department dropdown state changed:", open);
      setIsDepartmentDropdownOpen(open);

      if (open) {
        // Auto-load if we have very few items
        if (
          allDepartments.length <= 5 &&
          hasDepartmentNextPage &&
          !isDepartmentLoadingMore
        ) {
          console.log("🔄 Auto-loading department on open (few items)");
          setTimeout(() => {
            loadMoreDepartments();
          }, 100);
        }
      }
    },
    [
      allDepartments.length,
      hasDepartmentNextPage,
      isDepartmentLoadingMore,
      loadMoreDepartments,
    ]
  );

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
        // Reset infinite scroll state for departments
        setCurrentDepartmentPage(0);
        setAllDepartments([]);
        setHasDepartmentNextPage(true);
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
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        onOpenChange={handleDepartmentOpenChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={t("student.departmentNamePlaceholder")}
                          />
                        </SelectTrigger>
                        <SelectContent
                          className="h-64 overflow-y-auto"
                          onScroll={handleDepartmentScroll}
                        >
                          {allDepartments.map((item) => (
                            <SelectItem
                              key={item.id}
                              value={item.id.toString()}
                            >
                              {item.name}
                            </SelectItem>
                          ))}
                          {isDepartmentLoadingMore && (
                            <div className="flex items-center justify-center py-2">
                              <Loader className="h-4 w-4 animate-spin" />
                              <span className="ml-2 text-sm">
                                {t("common.loading")}
                              </span>
                            </div>
                          )}
                        </SelectContent>
                      </Select>
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
