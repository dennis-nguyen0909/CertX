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
import { useStudentCreate } from "@/hooks/student/use-student-create";
import { useState, useCallback, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import FormItem from "@/components/ui/form-item";
import { useClassList } from "@/hooks/class";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Student creation schema
const createStudentSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(1, t("student.validation.nameRequired")),
    studentCode: z.string().min(1, t("student.validation.studentCodeRequired")),
    email: z.string().email(t("student.validation.emailInvalid")),
    className: z.string().min(1, t("student.validation.classNameRequired")),
    departmentName: z
      .string()
      .min(1, t("student.validation.departmentNameRequired")),
    birthDate: z.string().min(1, t("student.validation.birthDateRequired")),
    course: z.string().min(1, t("student.validation.courseRequired")),
  });

type CreateStudentData = z.infer<ReturnType<typeof createStudentSchema>>;

interface CreateDialogProps {
  defaultClassName?: string;
}

export function CreateDialog({ defaultClassName }: CreateDialogProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { mutate: createStudent, isPending, error } = useStudentCreate();

  // Infinite scroll state
  const [currentPage, setCurrentPage] = useState(0);
  const [allClasses, setAllClasses] = useState<
    { id: number; className: string }[]
  >([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { data: classList, isLoading } = useClassList({
    pageIndex: currentPage,
    pageSize: 10,
  });

  // Update allClasses when new data arrives
  useEffect(() => {
    if (classList?.items) {
      console.log(
        "🔄 Loading page:",
        currentPage,
        "Items:",
        classList.items.length
      );
      if (currentPage === 0) {
        setAllClasses(classList.items);
      } else {
        setAllClasses((prev) => {
          const newItems = [...prev, ...classList.items];
          console.log("📦 Total classes loaded:", newItems.length);
          return newItems;
        });
      }
      const hasMore = !!classList.meta?.nextPage;
      console.log("📄 Has next page:", hasMore);
      setHasNextPage(hasMore);
      setIsLoadingMore(false);
    }
  }, [classList, currentPage]);

  const loadMore = useCallback(() => {
    console.log("🚀 Load more triggered", {
      isLoadingMore,
      hasNextPage,
      isLoading,
      currentPage,
      isDropdownOpen,
    });
    if (!isLoadingMore && hasNextPage && !isLoading && isDropdownOpen) {
      console.log("✅ Loading next page:", currentPage + 1);
      setIsLoadingMore(true);
      setCurrentPage((prev) => prev + 1);
    }
  }, [isLoadingMore, hasNextPage, isLoading, currentPage, isDropdownOpen]);

  // Auto-load more when dropdown opens or when we have few items
  useEffect(() => {
    if (
      isDropdownOpen &&
      allClasses.length < 20 &&
      hasNextPage &&
      !isLoadingMore &&
      !isLoading
    ) {
      console.log("🔄 Auto-loading more items on dropdown open");
      setTimeout(() => {
        loadMore();
      }, 200);
    }
  }, [
    isDropdownOpen,
    allClasses.length,
    hasNextPage,
    isLoadingMore,
    isLoading,
    loadMore,
  ]);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const element = e.currentTarget;
      const { scrollTop, scrollHeight, clientHeight } = element;
      const isNearBottom = scrollHeight - scrollTop <= clientHeight + 20;

      console.log("📜 Scroll event:", {
        scrollTop: Math.round(scrollTop),
        scrollHeight,
        clientHeight,
        remaining: Math.round(scrollHeight - scrollTop - clientHeight),
        isNearBottom,
        hasNextPage,
        isLoadingMore,
      });

      if (isNearBottom && hasNextPage && !isLoadingMore) {
        console.log("⬇️ Auto-loading more items");
        loadMore();
      }
    },
    [hasNextPage, isLoadingMore, loadMore]
  );

  // Handle dropdown open/close
  const handleOpenChange = useCallback(
    (open: boolean) => {
      console.log("🔽 Dropdown state changed:", open);
      setIsDropdownOpen(open);

      if (open) {
        // Auto-load if we have very few items
        if (allClasses.length <= 5 && hasNextPage && !isLoadingMore) {
          console.log("🔄 Auto-loading on open (few items)");
          setTimeout(() => {
            loadMore();
          }, 100);
        }
      }
    },
    [allClasses.length, hasNextPage, isLoadingMore, loadMore]
  );

  const form = useForm<CreateStudentData>({
    resolver: zodResolver(createStudentSchema(t)),
    defaultValues: {
      name: "",
      studentCode: "",
      email: "",
      className: defaultClassName || "",
      departmentName: "",
      birthDate: "",
      course: "",
    },
  });

  const handleSubmit = (data: CreateStudentData) => {
    createStudent(data, {
      onSuccess: () => {
        form.reset();
        setOpen(false);
        // Reset infinite scroll state
        setCurrentPage(0);
        setAllClasses([]);
        setHasNextPage(true);
        // Invalidate and refetch the student list
        queryClient.invalidateQueries({ queryKey: ["student-list"] });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{t("student.create")}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("student.createNew")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem
                  label={t("student.name")}
                  required
                  inputComponent={
                    <FormControl>
                      <Input
                        placeholder={t("student.namePlaceholder")}
                        className="h-12 text-base w-full"
                        {...field}
                      />
                    </FormControl>
                  }
                />
              )}
            />

            <FormField
              control={form.control}
              name="studentCode"
              render={({ field }) => (
                <FormItem
                  label={t("student.studentCode")}
                  required
                  inputComponent={
                    <FormControl>
                      <Input
                        placeholder={t("student.studentCodePlaceholder")}
                        className="h-12 text-base w-full"
                        {...field}
                      />
                    </FormControl>
                  }
                />
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem
                  label={t("student.email")}
                  required
                  inputComponent={
                    <FormControl>
                      <Input
                        type="email"
                        placeholder={t("student.emailPlaceholder")}
                        className="h-12 text-base w-full"
                        {...field}
                      />
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
                  label={t("student.className")}
                  required
                  inputComponent={
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || defaultClassName}
                        onOpenChange={handleOpenChange}
                      >
                        <SelectTrigger className="h-12 text-base w-full">
                          <SelectValue placeholder={t("student.className")} />
                        </SelectTrigger>
                        <SelectContent
                          className="h-64 overflow-y-auto"
                          onScroll={handleScroll}
                        >
                          {allClasses.map((item) => (
                            <SelectItem key={item.id} value={item.className}>
                              {item.className}
                            </SelectItem>
                          ))}
                          {isLoadingMore && (
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
              name="departmentName"
              render={({ field }) => (
                <FormItem
                  label={t("student.departmentName")}
                  required
                  inputComponent={
                    <FormControl>
                      <Input
                        placeholder={t("student.departmentNamePlaceholder")}
                        className="h-12 text-base w-full"
                        {...field}
                      />
                    </FormControl>
                  }
                />
              )}
            />

            <FormField
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <FormItem
                  label={t("student.birthDate")}
                  required
                  inputComponent={
                    <FormControl>
                      <Input
                        type="date"
                        className="h-12 text-base w-full"
                        {...field}
                      />
                    </FormControl>
                  }
                />
              )}
            />

            <FormField
              control={form.control}
              name="course"
              render={({ field }) => (
                <FormItem
                  label={t("student.course")}
                  required
                  inputComponent={
                    <FormControl>
                      <Input
                        placeholder={t("student.coursePlaceholder")}
                        className="h-12 text-base w-full"
                        {...field}
                      />
                    </FormControl>
                  }
                />
              )}
            />

            <div className="flex justify-end gap-3 pt-6">
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                className="h-12 px-6 text-base"
                onClick={() => {
                  form.reset();
                  setOpen(false);
                }}
              >
                {t("common.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={isPending || !form.formState.isValid}
                className="h-12 px-6 text-base"
              >
                {isPending && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                {isPending ? t("common.creating") : t("common.create")}
              </Button>
            </div>

            {error && (
              <div className="text-red-500 text-sm mt-4 p-3 bg-red-50 rounded-md">
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
