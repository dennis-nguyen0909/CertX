import { z } from "zod";

export const createStudentSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(1, t("student.validation.nameRequired")),
    studentCode: z.string().min(1, t("student.validation.studentCodeRequired")),
    email: z.string().email(t("student.validation.emailInvalid")),
    className: z
      .any()
      .refine(
        (val) => val && val.value,
        t("student.validation.classNameRequired")
      ),
    departmentName: z
      .any()
      .refine(
        (val) => val && val.value,
        t("student.validation.departmentNameRequired")
      ),
    birthDate: z.string().min(1, t("student.validation.birthDateRequired")),
    course: z.string().min(1, t("student.validation.courseRequired")),
  });
