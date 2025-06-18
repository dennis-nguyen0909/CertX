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
import { useStudentCreate, useStudentDepartmentOfClass } from "@/hooks/student";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { createStudentSchema } from "@/schemas/student/student-create.schema";

// Define API error type
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

type CreateStudentData = z.infer<ReturnType<typeof createStudentSchema>>;

interface CreateDialogProps {
  defaultClassName: string;
  classId: string;
}

export function CreateDialog({ defaultClassName, classId }: CreateDialogProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const {
    mutate: getDepartments,
    data: departmentsData,
    isPending: isLoadingDepartments,
  } = useStudentDepartmentOfClass();

  useEffect(() => {
    if (classId) {
      getDepartments(parseInt(classId));
    }
  }, [classId, getDepartments]);

  console.log("departmentsData", departmentsData);

  const { mutate: createStudent, isPending: isCreatingStudent } =
    useStudentCreate();

  const form = useForm<CreateStudentData>({
    resolver: zodResolver(createStudentSchema(t)),
    defaultValues: {
      name: "",
      studentCode: "",
      email: "",
      className: defaultClassName,
      departmentName: "",
      birthDate: "",
      course: "",
    },
  });

  useEffect(() => {
    form.setValue("className", defaultClassName);
  }, [defaultClassName, form]);

  const handleSubmit = async (data: CreateStudentData) => {
    createStudent(
      { ...data, className: classId },
      {
        onSuccess: () => {
          toast.success(t("student.createSuccess"));
          form.reset();
          setOpen(false);
          setError(null);
          queryClient.invalidateQueries({ queryKey: ["student-list"] });
        },
        onError: (err: unknown) => {
          const apiError = err as ApiError;
          const errorMessage =
            apiError?.response?.data?.message ||
            apiError?.message ||
            t("student.createError");
          setError(errorMessage);
          toast.error(errorMessage);
        },
      }
    );
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
                      <Input
                        className="h-12 text-base w-full"
                        {...field}
                        disabled
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
                          ) : departmentsData ? (
                            <SelectItem value={departmentsData.id.toString()}>
                              {departmentsData.name}
                            </SelectItem>
                          ) : (
                            <div className="flex items-center justify-center py-4">
                              <span className="text-sm text-gray-500">
                                {t("common.noData")}
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
              <div className="text-red-500 text-sm font-medium">{error}</div>
            )}

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={isCreatingStudent}>
                {isCreatingStudent && (
                  <Loader className="h-4 w-4 animate-spin mr-2" />
                )}
                {t("common.create")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
