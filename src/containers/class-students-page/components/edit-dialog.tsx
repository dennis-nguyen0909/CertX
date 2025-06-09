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

const formSchema = z.object({
  name: z.string().min(1, "student.nameRequired"),
  studentCode: z.string().min(1, "student.studentCodeRequired"),
  email: z.string().email("student.emailInvalid"),
  className: z.string().min(1, "student.classNameRequired"),
  departmentName: z.string().min(1, "student.departmentNameRequired"),
  birthDate: z.string().min(1, "student.birthDateRequired"),
  course: z.string().min(1, "student.courseRequired"),
});

type FormData = z.infer<typeof formSchema>;

interface EditDialogProps {
  open: boolean;
  id: string;
}

export function EditDialog({ open, id }: EditDialogProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
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

  useEffect(() => {
    getStudent(parseInt(id), {
      onSuccess: (data) => {
        if (data) {
          form.reset({
            name: data.name || "",
            studentCode: data.studentCode || "",
            email: data.email || "",
            className: data.className || "",
            departmentName: data.departmentName || "",
            birthDate: data.birthDate ? data.birthDate.split("T")[0] : "",
            course: data.course || "",
          });
        }
      },
    });
  }, [getStudent, id, form]);

  const handleSubmit = (formData: FormData) => {
    updateStudent(
      {
        id: parseInt(id),
        ...formData,
      },
      {
        onSuccess: () => {
          // Invalidate and refetch the student list
          queryClient.invalidateQueries({
            queryKey: ["student-list"],
          });
          router.back();
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
                          placeholder={t("student.classNamePlaceholder")}
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
                        <Input
                          placeholder={t("student.departmentNamePlaceholder")}
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
