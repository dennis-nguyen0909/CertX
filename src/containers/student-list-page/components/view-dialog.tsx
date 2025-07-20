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
import { useStudentDetail } from "@/hooks/student/use-student-detail";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Form, FormField, FormControl } from "@/components/ui/form";
import FormItem from "@/components/ui/form-item";
import * as z from "zod";
import { updateStudentSchema } from "@/schemas/student/student-update.schema";

interface ViewDialogProps {
  open: boolean;
  id: string;
}

type FormData = z.infer<ReturnType<typeof updateStudentSchema>>;

export function ViewDialog({ open, id }: ViewDialogProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { mutate: getStudent, isPending: isPendingGetStudent } =
    useStudentDetail();

  const form = useForm<FormData>({
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

  return (
    <Dialog open={open} onOpenChange={() => router.back()}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("student.view")}</DialogTitle>
        </DialogHeader>
        {isPendingGetStudent ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="ml-2">{t("common.loading")}</span>
          </div>
        ) : (
          <Form {...form}>
            <form className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem
                    label={t("student.name")}
                    inputComponent={
                      <FormControl>
                        <Input
                          placeholder={t("student.namePlaceholder")}
                          className={inputClass}
                          {...field}
                          readOnly
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
                    inputComponent={
                      <FormControl>
                        <Input
                          placeholder={t("student.studentCodePlaceholder")}
                          className={inputClass}
                          {...field}
                          readOnly
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
                    inputComponent={
                      <FormControl>
                        <Input
                          type="email"
                          placeholder={t("student.emailPlaceholder")}
                          className={inputClass}
                          {...field}
                          readOnly
                        />
                      </FormControl>
                    }
                  />
                )}
              />

              <FormField
                control={form.control}
                name="departmentId"
                render={() => (
                  <FormItem
                    label={t("student.departmentName")}
                    inputComponent={
                      <FormControl>
                        <Input
                          value={form.getValues("departmentName")?.label || ""}
                          className={inputClass}
                          readOnly
                        />
                      </FormControl>
                    }
                  />
                )}
              />

              <FormField
                control={form.control}
                name="classId"
                render={() => (
                  <FormItem
                    label={t("student.className")}
                    inputComponent={
                      <FormControl>
                        <Input
                          value={form.getValues("className")?.label || ""}
                          className={inputClass}
                          readOnly
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
                    inputComponent={
                      <FormControl>
                        <Input
                          type="date"
                          className={inputClass}
                          {...field}
                          readOnly
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
                    inputComponent={
                      <FormControl>
                        <Input
                          placeholder={t("student.coursePlaceholder")}
                          className={inputClass}
                          {...field}
                          readOnly
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
                  onClick={() => router.back()}
                  className="h-10 px-5 text-sm"
                >
                  {t("common.cancel")}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
