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
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormField, FormControl } from "@/components/ui/form";
import FormItem from "@/components/ui/form-item";
import { toast } from "sonner";
import { updateStudentSchema } from "@/schemas/student/student-update.schema";
import DepartmentSelect from "@/components/single-select/department-select";
import ClassSelect from "@/components/single-select/class-select";
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

  const { mutate: updateStudent, isPending } = useStudentUpdate();
  const { mutate: getStudent, isPending: isPendingGetStudent } =
    useStudentDetail();

  const form = useForm<FormData>({
    resolver: zodResolver(updateStudentSchema(t)),
    defaultValues: {
      name: "",
      studentCode: "",
      email: "",
      className: null,
      departmentName: null,
      birthDate: "",
      course: "",
      classId: null,
      departmentId: null,
    },
  });

  // Watch for department changes
  const selectedDepartment = form.watch("departmentName") as Option | null;

  useEffect(() => {
    // When department changes, reset class
    const subscription = form.watch((value, { name }) => {
      if (name === "departmentName") {
        form.setValue("className", null);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  useEffect(() => {
    if (id) {
      getStudent(parseInt(id), {
        onSuccess: (data) => {
          console.log("data12312", data);
          if (data) {
            form.reset({
              name: data.name || "",
              studentCode: data.studentCode || "",
              email: data.email || "",
              departmentName:
                data.departmentId && data.departmentName
                  ? {
                      value: String(data.departmentId),
                      label: data.departmentName,
                    }
                  : null,
              className:
                data.classId && data.className
                  ? { value: String(data.classId), label: data.className }
                  : null,
              classId: data.classId || undefined,
              departmentId: data.departmentId || undefined,
              birthDate: data.birthDate ? data.birthDate.split("T")[0] : "",
              course: data.course || "",
            });
          }
        },
      });
    }
  }, [getStudent, id, form]);

  const handleSubmit = (formData: FormData) => {
    const payload = {
      id: parseInt(id),
      ...formData,
      departmentName: (formData.departmentName as Option | null)?.value ?? "",
      className: (formData.className as Option | null)?.value ?? "",
    };

    updateStudent(payload, {
      onSuccess: () => {
        toast.success(t("student.updateSuccess"));
        queryClient.invalidateQueries({ queryKey: ["student-list"] });
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
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        if (!isPending) {
          router.back();
        }
      }}
    >
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
                name="departmentId"
                render={({ field }) => (
                  <FormItem
                    label={t("student.departmentName")}
                    required
                    inputComponent={
                      <FormControl>
                        <DepartmentSelect
                          placeholder={t("student.departmentNamePlaceholder")}
                          defaultValue={
                            field.value
                              ? {
                                  value: String(field.value),
                                  label:
                                    form.getValues("departmentName")?.label ||
                                    "",
                                }
                              : null
                          }
                          onChange={(option: Option | null) => {
                            field.onChange(
                              option?.value ? Number(option.value) : null
                            );
                            form.setValue("departmentName", option);
                          }}
                        />
                      </FormControl>
                    }
                  />
                )}
              />

              <FormField
                control={form.control}
                name="classId"
                render={({ field }) => (
                  <FormItem
                    label={t("student.className")}
                    required
                    inputComponent={
                      <FormControl>
                        <ClassSelect
                          departmentId={selectedDepartment?.value || ""}
                          placeholder={t("student.classNamePlaceholder")}
                          defaultValue={
                            field.value
                              ? {
                                  value: String(field.value),
                                  label:
                                    form.getValues("className")?.label || "",
                                }
                              : null
                          }
                          onChange={(option: Option | null) => {
                            field.onChange(
                              option?.value ? Number(option.value) : null
                            );
                            form.setValue("className", option);
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
