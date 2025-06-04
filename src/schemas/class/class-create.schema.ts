import { z } from "zod";

export const createClassSchema = (t: (key: string) => string) =>
  z.object({
    id: z.number({
      required_error: t("common.required"),
      invalid_type_error: t("common.required"),
    }),
    className: z.string().min(1, t("common.required")),
  });

export type CreateClassData = z.infer<ReturnType<typeof createClassSchema>>;
