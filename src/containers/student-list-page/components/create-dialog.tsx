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
import { useUserDepartmentList } from "@/hooks/user/use-user-department-list";
import { useStudentClassOfDepartment } from "@/hooks/student";

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

export function CreateDialog() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { mutate: createStudent, isPending, error } = useStudentCreate();

  // Infinite scroll state for classes
  const [currentPage, setCurrentPage] = useState(0);
  const [allClasses, setAllClasses] = useState<
    { id: number; className: string }[]
  >([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Infinite scroll state for departments
  const [currentDepartmentPage, setCurrentDepartmentPage] = useState(0);
  const [allDepartments, setAllDepartments] = useState<
    { id: number; name: string }[]
  >([]);
  const [hasDepartmentNextPage, setHasDepartmentNextPage] = useState(true);
  const [isDepartmentLoadingMore, setIsDepartmentLoadingMore] = useState(false);
  const [isDepartmentDropdownOpen, setIsDepartmentDropdownOpen] =
    useState(false);

  // Form state
  const form = useForm<CreateStudentData>({
    resolver: zodResolver(createStudentSchema(t)),
    defaultValues: {
      name: "",
      studentCode: "",
      email: "",
      className: "",
      departmentName: "",
      birthDate: "",
      course: "",
    },
  });

  // Watch selected department to fetch classes
  const selectedDepartmentId = form.watch("departmentName");

  // Use mutation hook for getting classes by department
  const {
    mutate: getClassesByDepartment,
    data: classListOfDepartment,
    error: classListError,
    isError: hasClassListError,
  } = useStudentClassOfDepartment();

  console.log("duydeptrai123", classListOfDepartment);

  const {
    data: classList,
    isLoading,
    error: generalClassError,
  } = useClassList({
    pageIndex: currentPage,
    pageSize: 10,
  });
  console.log("duydeptrai", allDepartments);

  const {
    data: departmentList,
    isLoading: isDepartmentLoading,
    error: departmentError,
  } = useUserDepartmentList({
    pageIndex: currentDepartmentPage,
    pageSize: 10,
  });

  // Reset class selection when department changes and fetch classes
  useEffect(() => {
    if (selectedDepartmentId) {
      // Reset class selection when department changes
      form.setValue("className", "");
      // Reset class pagination
      setCurrentPage(0);
      setAllClasses([]);
      setHasNextPage(true);

      // Trigger the mutation to get classes for this department
      const departmentIdNum = parseInt(selectedDepartmentId);
      if (departmentIdNum > 0) {
        getClassesByDepartment(departmentIdNum);
      }
    }
  }, [selectedDepartmentId, form, getClassesByDepartment]);

  // Update allClasses based on selected department
  useEffect(() => {
    if (selectedDepartmentId && classListOfDepartment?.data) {
      console.log(
        "🔄 Loading classes for department:",
        selectedDepartmentId,
        "Items:",
        classListOfDepartment.data.length
      );
      // Map the data to match expected structure
      const formattedClasses = classListOfDepartment.data.map(
        (item: { id: number; className?: string; name?: string }) => ({
          id: item.id,
          className: item.className || item.name || "",
        })
      );
      setAllClasses(formattedClasses);
      setHasNextPage(false); // Since we're getting all classes for a department
      setIsLoadingMore(false);
    } else if (!selectedDepartmentId && classList?.items) {
      // Fallback to general class list if no department selected
      console.log(
        "🔄 Loading general classes page:",
        currentPage,
        "Items:",
        classList.items.length
      );
      if (currentPage === 0) {
        setAllClasses(classList.items);
      } else {
        setAllClasses((prev) => {
          // Remove duplicates by filtering out items that already exist
          const existingIds = new Set(prev.map((item) => item.id));
          const uniqueNewItems = classList.items.filter(
            (item) => !existingIds.has(item.id)
          );
          const combined = [...prev, ...uniqueNewItems];
          console.log("📦 Total classes loaded:", combined.length);
          return combined;
        });
      }
      const hasMore = !!classList.meta?.nextPage;
      console.log("📄 Has next page:", hasMore);
      setHasNextPage(hasMore);
      setIsLoadingMore(false);
    }
  }, [classList, currentPage, classListOfDepartment, selectedDepartmentId]);

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

  const handleSubmit = (data: CreateStudentData) => {
    createStudent(data, {
      onSuccess: () => {
        form.reset();
        setOpen(false);
        // Reset infinite scroll state for classes
        setCurrentPage(0);
        setAllClasses([]);
        setHasNextPage(true);
        // Reset infinite scroll state for departments
        setCurrentDepartmentPage(0);
        setAllDepartments([]);
        setHasDepartmentNextPage(true);
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
              name="departmentName"
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
                        <SelectTrigger className="h-12 text-base w-full">
                          <SelectValue
                            placeholder={t("student.departmentNamePlaceholder")}
                          />
                        </SelectTrigger>
                        <SelectContent
                          className="h-64 overflow-y-auto"
                          onScroll={handleDepartmentScroll}
                        >
                          {departmentError ? (
                            <div className="flex items-center justify-center py-4 text-red-500">
                              <span className="text-sm">
                                {typeof departmentError === "object" &&
                                departmentError !== null &&
                                "response" in departmentError
                                  ? (
                                      departmentError as {
                                        response: { data: { message: string } };
                                      }
                                    ).response.data.message
                                  : t("common.errorLoadingDepartments")}
                              </span>
                            </div>
                          ) : (
                            <>
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
                            </>
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
                  label={t("student.className")}
                  required
                  inputComponent={
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        onOpenChange={handleOpenChange}
                      >
                        <SelectTrigger className="h-12 text-base w-full">
                          <SelectValue placeholder={t("student.className")} />
                        </SelectTrigger>
                        <SelectContent
                          className="h-64 overflow-y-auto"
                          onScroll={handleScroll}
                        >
                          {(hasClassListError && classListError) ||
                          (generalClassError && !selectedDepartmentId) ? (
                            <div className="flex items-center justify-center py-4 text-red-500">
                              <span className="text-sm">
                                {(() => {
                                  const error = hasClassListError
                                    ? classListError
                                    : generalClassError;
                                  return typeof error === "object" &&
                                    error !== null &&
                                    "response" in error
                                    ? (
                                        error as {
                                          response: {
                                            data: { message: string };
                                          };
                                        }
                                      ).response.data.message
                                    : t("common.errorLoadingClasses");
                                })()}
                              </span>
                            </div>
                          ) : (
                            <>
                              {allClasses.map((item) => (
                                <SelectItem
                                  key={item.id}
                                  value={item.id.toString()}
                                >
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
                            </>
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
