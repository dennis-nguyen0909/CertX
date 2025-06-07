import { TFunction } from "i18next";
import { z } from "zod";

export const createUserDepartmentSchema = (t: TFunction) =>
  z.object({
    name: z.string().min(1, t("validation.required")),
    email: z.string().email(t("validation.invalidEmail")),
    password: z.string().min(1, t("validation.required")),
  });

export const updateUserDepartmentSchema = (t: TFunction) =>
  z.object({
    name: z.string().min(1, t("validation.required")),
    email: z.string().email(t("validation.invalidEmail")),
  });

export type CreateUserDepartmentData = z.infer<
  ReturnType<typeof createUserDepartmentSchema>
>;

export type UpdateUserDepartmentData = z.infer<
  ReturnType<typeof updateUserDepartmentSchema>
>;
