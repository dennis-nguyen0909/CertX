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
import { useStudentCreate } from "@/hooks/student";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { createStudentSchema } from "@/schemas/student/student-create.schema";
import DepartmentSelect from "@/components/single-select/department-select";
import { Option } from "@/components/single-select/base";
import { DateTimePickerRange } from "@/components/ui/datetime-picker-range";
import { format } from "date-fns";
import ClassSelect from "@/components/single-select/class-select";

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

export function CreateDialog() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const { mutate: createStudent, isPending: isCreatingStudent } =
    useStudentCreate();
  // Form state
  const form = useForm<CreateStudentData>({
    resolver: zodResolver(createStudentSchema(t)),
    defaultValues: {
      name: "",
      studentCode: "",
      email: "",
      className: null,
      departmentName: null,
      birthDate: "",
      course: "",
    },
  });

  const handleSubmit = async (data: CreateStudentData) => {
    const payload = {
      ...data,
      departmentName: (data.departmentName as Option | null)?.value ?? "",
      className: (data.className as Option | null)?.value ?? "",
    };

    createStudent(payload, {
      onSuccess: () => {
        toast.success(
          t("common.createSuccess", { itemName: t("student.name") })
        );
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
  const selectedDepartment = form.watch("departmentName") as Option | null;

  useEffect(() => {
    if (selectedDepartment?.value) {
      // Reset className field when department changes
      form.setValue("className", null);
    }
  }, [selectedDepartment, form]);

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
                      <DepartmentSelect
                        placeholder={t("student.departmentNamePlaceholder")}
                        defaultValue={field.value as Option | null}
                        onChange={field.onChange}
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
                      <ClassSelect
                        departmentId={selectedDepartment?.value || ""}
                        placeholder={t("student.classNamePlaceholder")}
                        defaultValue={field.value as Option | null}
                        onChange={field.onChange}
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
                        value={field.value ? new Date(field.value) : undefined}
                        onChange={(date) =>
                          field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                        }
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
