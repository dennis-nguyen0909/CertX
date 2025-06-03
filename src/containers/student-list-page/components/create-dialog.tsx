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
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { useStudentCreate } from "@/hooks/student/use-student-create";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

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
  const { mutate: createStudent, isPending, error } = useStudentCreate();

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

  const handleSubmit = (data: CreateStudentData) => {
    createStudent(data, {
      onSuccess: () => {
        form.reset();
        setOpen(false);
        // Invalidate and refetch the student list
        queryClient.invalidateQueries({ queryKey: ["student-list"] });
      },
    });
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
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-base font-medium">
                    {t("student.name")} *
                  </Label>
                  <FormControl>
                    <Input
                      id="name"
                      placeholder={t("student.namePlaceholder")}
                      className="h-12 text-base"
                      {...field}
                    />
                  </FormControl>
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="studentCode"
              render={({ field }) => (
                <div className="space-y-3">
                  <Label
                    htmlFor="studentCode"
                    className="text-base font-medium"
                  >
                    {t("student.studentCode")} *
                  </Label>
                  <FormControl>
                    <Input
                      id="studentCode"
                      placeholder={t("student.studentCodePlaceholder")}
                      className="h-12 text-base"
                      {...field}
                    />
                  </FormControl>
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-base font-medium">
                    {t("student.email")} *
                  </Label>
                  <FormControl>
                    <Input
                      id="email"
                      type="email"
                      placeholder={t("student.emailPlaceholder")}
                      className="h-12 text-base"
                      {...field}
                    />
                  </FormControl>
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="className"
              render={({ field }) => (
                <div className="space-y-3">
                  <Label htmlFor="className" className="text-base font-medium">
                    {t("student.className")} *
                  </Label>
                  <FormControl>
                    <Input
                      id="className"
                      placeholder={t("student.classNamePlaceholder")}
                      className="h-12 text-base"
                      {...field}
                    />
                  </FormControl>
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="departmentName"
              render={({ field }) => (
                <div className="space-y-3">
                  <Label
                    htmlFor="departmentName"
                    className="text-base font-medium"
                  >
                    {t("student.departmentName")} *
                  </Label>
                  <FormControl>
                    <Input
                      id="departmentName"
                      placeholder={t("student.departmentNamePlaceholder")}
                      className="h-12 text-base"
                      {...field}
                    />
                  </FormControl>
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <div className="space-y-3">
                  <Label htmlFor="birthDate" className="text-base font-medium">
                    {t("student.birthDate")} *
                  </Label>
                  <FormControl>
                    <Input
                      id="birthDate"
                      type="date"
                      className="h-12 text-base"
                      {...field}
                    />
                  </FormControl>
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="course"
              render={({ field }) => (
                <div className="space-y-3">
                  <Label htmlFor="course" className="text-base font-medium">
                    {t("student.course")} *
                  </Label>
                  <FormControl>
                    <Input
                      id="course"
                      placeholder={t("student.coursePlaceholder")}
                      className="h-12 text-base"
                      {...field}
                    />
                  </FormControl>
                </div>
              )}
            />

            <div className="flex justify-end gap-3 pt-6">
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
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
                disabled={isPending || !form.formState.isValid}
                className="h-12 px-6 text-base"
              >
                {isPending && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                {isPending ? t("common.creating") : t("common.create")}
              </Button>
            </div>

            {error && (
              <div className="text-red-500 text-sm mt-4 p-3 bg-red-50 rounded-md">
                {typeof error === "object" &&
                error !== null &&
                "response" in error
                  ? (error as { response: { data: { message: string } } })
                      .response.data.message
                  : t("common.errorOccurred")}
              </div>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
