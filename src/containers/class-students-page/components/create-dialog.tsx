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
import { useStudentCreate, useStudentDepartmentOfClass } from "@/hooks/student";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
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

interface CreateDialogProps {
  defaultClassName: string;
  classId: string;
}

// Department type for department data
type Department = { id: number; name: string };

const createStudentSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(1, t("student.validation.nameRequired")),
    studentCode: z.string().min(1, t("student.validation.studentCodeRequired")),
    email: z.string().email(t("student.validation.emailInvalid")),
    className: z
      .object({ label: z.string(), value: z.string() })
      .nullable()
      .refine(
        (val) => !!val && !!val.value,
        t("student.validation.classNameRequired")
      ),
    departmentName: z.any().optional(),
    birthDate: z.string().min(1, t("student.validation.birthDateRequired")),
    course: z.string().min(1, t("student.validation.courseRequired")),
  });

export function CreateDialog({ defaultClassName, classId }: CreateDialogProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const { mutate: getDepartments, data: departmentsData } =
    useStudentDepartmentOfClass();

  useEffect(() => {
    if (classId) {
      getDepartments(parseInt(classId));
    }
  }, [classId, getDepartments]);

  const { mutate: createStudent, isPending: isCreatingStudent } =
    useStudentCreate();

  const form = useForm<CreateStudentData>({
    resolver: zodResolver(createStudentSchema(t)),
    defaultValues: {
      name: "",
      studentCode: "",
      email: "",
      className: { label: defaultClassName, value: classId },
      departmentName: departmentsData
        ? Array.isArray(departmentsData)
          ? departmentsData.length > 0
            ? {
                label: departmentsData[0].name,
                value: String(departmentsData[0].id),
              }
            : null
          : { label: departmentsData.name, value: String(departmentsData.id) }
        : null,
      birthDate: "",
      course: "",
    },
  });

  const handleSubmit = async (data: CreateStudentData) => {
    const payload = {
      ...data,
      departmentName: departmentsData
        ? Array.isArray(departmentsData)
          ? departmentsData.length > 0
            ? departmentsData[0].id
            : ""
          : departmentsData.id
        : "",
      className: classId,
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

  return (
    <Dialog open={open} onOpenChange={setOpen} modal={false}>
      <DialogTrigger asChild>
        <Button>{t("student.create")}</Button>
      </DialogTrigger>
      {open && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-10 pointer-events-none bg-black/50"
        />
      )}
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

            <div>
              <FormItem
                label={t("student.departmentName")}
                required
                inputComponent={
                  <FormControl>
                    <Input
                      value={
                        departmentsData
                          ? Array.isArray(departmentsData)
                            ? (departmentsData as Department[])
                                .map((d) => d.name)
                                .join(", ")
                            : (departmentsData as Department).name
                          : ""
                      }
                      disabled
                      className="h-12 text-base w-full bg-gray-100"
                    />
                  </FormControl>
                }
              />
            </div>

            <FormField
              control={form.control}
              name="className"
              render={({ field }) => (
                <FormItem
                  label={t("student.className")}
                  required
                  inputComponent={
                    <FormControl>
                      <div className="pointer-events-none opacity-70">
                        <ClassSelect
                          departmentId={""}
                          placeholder={t("student.classNamePlaceholder")}
                          defaultValue={field.value}
                          onChange={() => {}}
                        />
                      </div>
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
