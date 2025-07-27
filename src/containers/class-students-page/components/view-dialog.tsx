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
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormField, FormControl } from "@/components/ui/form";
import FormItem from "@/components/ui/form-item";

const viewStudentSchema = () =>
  z.object({
    name: z.string(),
    studentCode: z.string(),
    email: z.string(),
    className: z.string(),
    departmentName: z.string(),
    birthDate: z.string(),
    course: z.string(),
    coin: z.string().optional(), // Add coin as optional string
  });

type FormData = z.infer<ReturnType<typeof viewStudentSchema>>;

interface ViewDialogProps {
  open: boolean;
  id: string;
}

export function ViewDialog({ open, id }: ViewDialogProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(viewStudentSchema()),
    defaultValues: {
      name: "",
      studentCode: "",
      email: "",
      className: "",
      departmentName: "",
      birthDate: "",
      course: "",
      coin: "",
    },
  });

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
            coin: data.coin || "",
          });
        }
      },
    });
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
                        <Input {...field} disabled />
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
                        <Input {...field} disabled />
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
                        <Input {...field} disabled />
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
                    inputComponent={
                      <FormControl>
                        <Input {...field} disabled />
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
                    inputComponent={
                      <FormControl>
                        <Input {...field} disabled />
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
                        <Input type="date" {...field} disabled />
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
                        <Input {...field} disabled />
                      </FormControl>
                    }
                  />
                )}
              />
              <FormField
                control={form.control}
                name="coin"
                render={({ field }) => (
                  <FormItem
                    label={t("student.coin")}
                    inputComponent={
                      <FormControl>
                        <Input {...field} disabled />
                      </FormControl>
                    }
                  />
                )}
              />
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  {t("common.close")}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
