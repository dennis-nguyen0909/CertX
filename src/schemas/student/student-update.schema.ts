import { z } from "zod";

export const updateStudentSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(1, t("student.validation.nameRequired")),
    studentCode: z.string().min(1, t("student.validation.studentCodeRequired")),
    email: z.string().email(t("student.validation.emailInvalid")),
    className: z.any(),
    departmentName: z.any(),
    classId: z.number().nullable(),
    departmentId: z.number().nullable(),
    birthDate: z.string().min(1, t("student.validation.birthDateRequired")),
    course: z.string().min(1, t("student.validation.courseRequired")),
  });
