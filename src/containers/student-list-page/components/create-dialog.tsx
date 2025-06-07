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
import { useEffect, useState } from "react";
import { z } from "zod";
import FormItem from "@/components/ui/form-item";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserDepartmentList } from "@/hooks/user/use-user-department-list";
import { useStudentClassOfDepartment, useStudentCreate } from "@/hooks/student";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

// Define the class item type to fix linter error
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
  const [error, setError] = useState<string | null>(null);
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

  const { mutate: createStudent, isPending: isCreatingStudent } =
    useStudentCreate();
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

  const handleSubmit = async (data: CreateStudentData) => {
    createStudent(data, {
      onSuccess: () => {
        toast.success(t("student.createSuccess"));
        form.reset();
        setOpen(false);
        setError(null);
        queryClient.invalidateQueries({ queryKey: ["student-list"] });
      },
      onError: (err: unknown) => {
        console.error("Create student error:", err);
        const apiError = err as ApiError;
        const errorMessage =
          apiError?.response?.data?.message ||
          apiError?.message ||
          t("student.createError");
        setError(errorMessage);
        toast.error(errorMessage);
      },
    });
  };

  // Watch for department changes
  const selectedDepartmentId = form.watch("departmentName");

  // Helper function to get department details by ID

  useEffect(() => {
    if (selectedDepartmentId) {
      // Reset className field when department changes
      form.setValue("className", "");
      listClasses(selectedDepartmentId);
    }
  }, [selectedDepartmentId]);

  console.log("listClassesData", listClassesData);

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
                disabled={isCreatingStudent}
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
                disabled={isCreatingStudent || !form.formState.isValid}
                className="h-12 px-6 text-base"
              >
                {isCreatingStudent && (
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isCreatingStudent ? t("common.creating") : t("common.create")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
