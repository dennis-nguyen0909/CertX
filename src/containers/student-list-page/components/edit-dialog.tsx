"use client";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useStudentUpdate } from "@/hooks/student/use-student-update";
import { useStudentDetail } from "@/hooks/student/use-student-detail";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

interface EditDialogProps {
  open: boolean;
  id: string;
}

export function EditDialog({ open, id }: EditDialogProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: "",
    studentCode: "",
    email: "",
    className: "",
    departmentName: "",
    birthDate: "",
    course: "",
  });

  const { mutate: updateStudent, isPending } = useStudentUpdate();
  const { mutate: getStudent, isPending: isPendingGetStudent } =
    useStudentDetail();

  useEffect(() => {
    getStudent(parseInt(id), {
      onSuccess: (data) => {
        if (data) {
          setFormData({
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
  }, [getStudent, id]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="name" className="text-base font-medium">
                {t("student.name")} *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder={t("student.namePlaceholder")}
                className="h-12 text-base"
                required
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="studentCode" className="text-base font-medium">
                {t("student.studentCode")} *
              </Label>
              <Input
                id="studentCode"
                value={formData.studentCode}
                onChange={(e) =>
                  handleInputChange("studentCode", e.target.value)
                }
                placeholder={t("student.studentCodePlaceholder")}
                className="h-12 text-base"
                required
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="email" className="text-base font-medium">
                {t("student.email")} *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder={t("student.emailPlaceholder")}
                className="h-12 text-base"
                required
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="className" className="text-base font-medium">
                {t("student.className")} *
              </Label>
              <Input
                id="className"
                value={formData.className}
                onChange={(e) => handleInputChange("className", e.target.value)}
                placeholder={t("student.classNamePlaceholder")}
                className="h-12 text-base"
                required
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="departmentName" className="text-base font-medium">
                {t("student.departmentName")} *
              </Label>
              <Input
                id="departmentName"
                value={formData.departmentName}
                onChange={(e) =>
                  handleInputChange("departmentName", e.target.value)
                }
                placeholder={t("student.departmentNamePlaceholder")}
                className="h-12 text-base"
                required
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="birthDate" className="text-base font-medium">
                {t("student.birthDate")} *
              </Label>
              <Input
                id="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={(e) => handleInputChange("birthDate", e.target.value)}
                className="h-12 text-base"
                required
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="course" className="text-base font-medium">
                {t("student.course")} *
              </Label>
              <Input
                id="course"
                value={formData.course}
                onChange={(e) => handleInputChange("course", e.target.value)}
                placeholder={t("student.coursePlaceholder")}
                className="h-12 text-base"
                required
              />
            </div>

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
        )}
      </DialogContent>
    </Dialog>
  );
}
