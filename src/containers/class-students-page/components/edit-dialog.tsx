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
import { useEffect, useState } from "react";
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
import { useStudentDepartmentOfClass } from "@/hooks/student";
import { toast } from "sonner";
import { useClassDetailByName } from "@/hooks/class";
import { updateStudentSchema } from "@/schemas/student/student-update.schema";
import DepartmentSelect from "@/components/single-select/department-select";
import { Option } from "@/components/single-select/base";

// Define API error type
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

type FormData = z.infer<ReturnType<typeof updateStudentSchema>> & {
  departmentName?: Option | null;
};

interface EditDialogProps {
  open: boolean;
  id: string;
}

export function EditDialog({ open, id }: EditDialogProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const { mutate: getDepartments } = useStudentDepartmentOfClass();

  const form = useForm<FormData>({
    resolver: zodResolver(updateStudentSchema(t)),
    defaultValues: {
      name: "",
      studentCode: "",
      email: "",
      className: "",
      departmentName: null,
      departmentId: null,

      birthDate: "",
      course: "",
    },
  });

  const { mutate: updateStudent, isPending } = useStudentUpdate();
  const { mutate: getStudent, isPending: isPendingGetStudent } =
    useStudentDetail();

  const { mutate: getClassDetail } = useClassDetailByName();

  useEffect(() => {
    getStudent(parseInt(id), {
      onSuccess: (data) => {
        if (data) {
          getClassDetail(data.className, {
            onSuccess: (classDetail) => {
              if (classDetail) {
                getDepartments(classDetail.id, {
                  onSuccess: () => {
                    form.reset({
                      name: data.name || "",
                      studentCode: data.studentCode || "",
                      email: data.email || "",
                      className: data.className || "",
                      departmentName:
                        data.departmentId && data.departmentName
                          ? {
                              value: String(data.departmentId),
                              label: data.departmentName,
                            }
                          : null,
                      departmentId: data.departmentId,
                      birthDate: data.birthDate
                        ? data.birthDate.split("T")[0]
                        : "",
                      course: data.course || "",
                    });
                  },
                });
              }
            },
          });
        }
      },
    });
  }, [getStudent, id, form, getDepartments, getClassDetail]);

  const handleSubmit = (formData: FormData) => {
    updateStudent(
      {
        id: parseInt(id),
        name: formData.name,
        studentCode: formData.studentCode,
        email: formData.email,
        className: formData.className ?? "",
        birthDate: formData.birthDate,
        course: formData.course,
        departmentName: (formData.departmentId as Option | null)?.label ?? "",
      },
      {
        onSuccess: () => {
          toast.success(t("student.updateSuccess"));
          queryClient.invalidateQueries({
            queryKey: ["student-list"],
          });
          router.back();
          setError(null);
        },
        onError: (err: unknown) => {
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
                name="className"
                render={({ field }) => (
                  <FormItem
                    label={t("student.className")}
                    required
                    inputComponent={
                      <FormControl>
                        <Input
                          {...field}
                          className="h-12 text-base w-full"
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
                        <DepartmentSelect
                          placeholder={t("student.departmentNamePlaceholder")}
                          defaultValue={field.value}
                          onChange={(option: Option | null) => {
                            field.onChange(option);
                          }}
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

              {error && (
                <div className="text-red-500 text-sm font-medium">{error}</div>
              )}

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  {t("common.cancel")}
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending && (
                    <Loader className="h-4 w-4 animate-spin mr-2" />
                  )}
                  {t("common.save")}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
