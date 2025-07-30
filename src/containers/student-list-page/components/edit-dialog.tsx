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
import { useEffect } from "react";
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
import { DateTimePickerRange } from "@/components/ui/datetime-picker-range";
import { isAxiosError } from "axios";

type FormData = z.infer<ReturnType<typeof updateStudentSchema>>;

interface EditDialogProps {
  open: boolean;
  id: string;
}

export function EditDialog({ open, id }: EditDialogProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: updateStudent, isPending, error } = useStudentUpdate();
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

  const inputClass = "h-10 text-sm w-full";

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
        toast.success(
          t("common.updateSuccess", { itemName: t("student.name") })
        );
        queryClient.invalidateQueries({ queryKey: ["student-list"] });
        router.back();
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
      modal={false}
    >
      {open && (
        <div className="fixed inset-0 z-40 bg-black/50 pointer-events-none" />
      )}
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto z-50">
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
                          className={inputClass}
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
                          className={inputClass}
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
                          className={inputClass}
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
                          className="text-sm"
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
                          className="text-sm"
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
                        <DateTimePickerRange
                          placeholder={t("student.birthDatePlaceholder")}
                          value={
                            field.value ? new Date(field.value) : undefined
                          }
                          onChange={(date) =>
                            field.onChange(
                              date ? date.toISOString().split("T")[0] : ""
                            )
                          }
                          className={inputClass}
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
                          className={inputClass}
                          {...field}
                        />
                      </FormControl>
                    }
                  />
                )}
              />

              {isAxiosError(error) && (
                <p className="text-red-500 text-sm">
                  {error.response?.data.message}
                </p>
              )}

              <div className="flex justify-end gap-3 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isPending}
                  className="h-10 px-5 text-sm"
                >
                  {t("common.cancel")}
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="h-10 px-5 text-sm"
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
