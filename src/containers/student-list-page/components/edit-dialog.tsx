"use client";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useCallback } from "react";
import { useStudentUpdate } from "@/hooks/student/use-student-update";
import { useStudentDetail } from "@/hooks/student/use-student-detail";
import { useRouter } from "next/navigation";
import { Loader2, Loader } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormField, FormControl } from "@/components/ui/form";
import FormItem from "@/components/ui/form-item";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserDepartmentList } from "@/hooks/user/use-user-department-list";
import { useStudentClassOfDepartment } from "@/hooks/student";
import { toast } from "sonner";

// Define the class item type
interface ClassItem {
  id: number;
  className: string;
}

// Define API error type
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

// Student update schema
const updateStudentSchema = (t: (key: string) => string) =>
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

type FormData = z.infer<ReturnType<typeof updateStudentSchema>>;

interface EditDialogProps {
  open: boolean;
  id: string;
}

export function EditDialog({ open, id }: EditDialogProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [originalStudentData, setOriginalStudentData] = useState<{
    name?: string;
    studentCode?: string;
    email?: string;
    className?: string;
    departmentName?: string;
    birthDate?: string;
    course?: string;
  } | null>(null);

  // Load departments and classes
  const { data: listDepartments, isLoading: isLoadingDepartments } =
    useUserDepartmentList({
      pageIndex: 0,
      pageSize: 1000,
    });

  const {
    mutate: listClasses,
    data: listClassesData,
    isPending: isLoadingClasses,
  } = useStudentClassOfDepartment();

  const form = useForm<FormData>({
    resolver: zodResolver(updateStudentSchema(t)),
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

  const { mutate: updateStudent, isPending } = useStudentUpdate();
  const { mutate: getStudent, isPending: isPendingGetStudent } =
    useStudentDetail();

  // Watch for department changes
  const selectedDepartmentId = form.watch("departmentName");

  useEffect(() => {
    if (selectedDepartmentId) {
      listClasses(selectedDepartmentId);
    }
  }, [selectedDepartmentId, listClasses]);

  // Helper functions to find department/class IDs by name
  const findDepartmentIdByName = useCallback(
    (departmentName: string) => {
      if (!listDepartments?.items) return departmentName;
      const department = listDepartments.items.find(
        (dept) => dept.name === departmentName
      );
      return department ? department.id.toString() : departmentName;
    },
    [listDepartments?.items]
  );

  const findClassIdByName = useCallback(
    (className: string) => {
      if (!listClassesData?.data) return className;
      const classItem = listClassesData.data.find(
        (cls: ClassItem) => cls.className === className
      );
      return classItem ? classItem.id.toString() : className;
    },
    [listClassesData?.data]
  );

  useEffect(() => {
    getStudent(parseInt(id), {
      onSuccess: (data) => {
        if (data) {
          // Store original data
          setOriginalStudentData(data);

          // Find department ID by name if departments are loaded
          const departmentId = listDepartments?.items
            ? findDepartmentIdByName(data.departmentName || "")
            : data.departmentName || "";

          form.reset({
            name: data.name || "",
            studentCode: data.studentCode || "",
            email: data.email || "",
            className: data.className || "",
            departmentName: departmentId,
            birthDate: data.birthDate ? data.birthDate.split("T")[0] : "",
            course: data.course || "",
          });

          // Load classes for the selected department
          if (departmentId) {
            listClasses(departmentId);
          }
        }
      },
    });
  }, [
    getStudent,
    id,
    form,
    listClasses,
    listDepartments,
    findDepartmentIdByName,
  ]);

  // Update className field when classes data is loaded
  useEffect(() => {
    if (listClassesData?.data && originalStudentData?.className) {
      const classId = findClassIdByName(originalStudentData.className);
      form.setValue("className", classId);
    }
  }, [listClassesData, originalStudentData, form, findClassIdByName]);

  const handleSubmit = (formData: FormData) => {
    updateStudent(
      {
        id: parseInt(id),
        ...formData,
      },
      {
        onSuccess: () => {
          toast.success(t("student.updateSuccess"));
          // Invalidate and refetch the student list
          queryClient.invalidateQueries({
            queryKey: ["student-list"],
          });
          router.back();
          setError(null);
        },
        onError: (err: unknown) => {
          console.error("Update student error:", err);
          const apiError = err as ApiError;
          const errorMessage =
            apiError?.response?.data?.message ||
            apiError?.message ||
            t("student.updateError");
          setError(errorMessage);
          toast.error(errorMessage);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={() => router.back()}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("student.edit")}</DialogTitle>
        </DialogHeader>
        {isPendingGetStudent ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="ml-2">{t("common.loading")}</span>
          </div>
        ) : (
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
                          disabled={isLoadingDepartments}
                        >
                          <SelectTrigger className="h-12 text-base w-full">
                            <SelectValue
                              placeholder={
                                isLoadingDepartments
                                  ? t("common.loading")
                                  : t("student.departmentNamePlaceholder")
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {isLoadingDepartments ? (
                              <div className="flex items-center justify-center py-4">
                                <Loader className="h-4 w-4 animate-spin mr-2" />
                                <span className="text-sm text-gray-500">
                                  {t("common.loading")}
                                </span>
                              </div>
                            ) : listDepartments?.items &&
                              listDepartments.items.length > 0 ? (
                              listDepartments.items.map((department) => (
                                <SelectItem
                                  key={department.id}
                                  value={department.id.toString()}
                                >
                                  {department.name}
                                </SelectItem>
                              ))
                            ) : (
                              <div className="flex items-center justify-center py-4">
                                <span className="text-sm text-gray-500">
                                  {t("student.noDepartment")}
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
                    label={t("student.className")}
                    required
                    inputComponent={
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={
                            isLoadingDepartments ||
                            !selectedDepartmentId ||
                            isLoadingClasses
                          }
                        >
                          <SelectTrigger className="h-12 text-base w-full">
                            <SelectValue
                              placeholder={
                                isLoadingDepartments
                                  ? t("common.loading")
                                  : !selectedDepartmentId
                                  ? t("student.selectDepartmentFirst")
                                  : isLoadingClasses
                                  ? t("common.loading")
                                  : t("student.className")
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {isLoadingClasses ? (
                              <div className="flex items-center justify-center py-4">
                                <Loader className="h-4 w-4 animate-spin mr-2" />
                                <span className="text-sm text-gray-500">
                                  {t("common.loading")}
                                </span>
                              </div>
                            ) : listClassesData?.data &&
                              listClassesData.data.length > 0 ? (
                              listClassesData.data.map((item: ClassItem) => (
                                <SelectItem
                                  key={item.id}
                                  value={item.id.toString()}
                                >
                                  {item.className}
                                </SelectItem>
                              ))
                            ) : (
                              <div className="flex items-center justify-center py-4">
                                <span className="text-sm text-gray-500">
                                  {t("student.noClass")}
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

              {error && (
                <div className="text-red-500 text-sm mt-4 p-3 bg-red-50 rounded-md">
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isPending}
                  className="h-12 px-6 text-base"
                >
                  {t("common.cancel")}
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="h-12 px-6 text-base"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      {t("common.saving")}
                    </>
                  ) : (
                    t("common.save")
                  )}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
