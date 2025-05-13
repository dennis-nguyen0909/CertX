import { z } from "zod";

export const createCertificatesTypeSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(1, t("common.required")),
  });

export type CreateCertificatesTypeData = z.infer<
  ReturnType<typeof createCertificatesTypeSchema>
>;
