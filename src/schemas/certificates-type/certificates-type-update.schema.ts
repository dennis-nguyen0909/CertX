import { z } from "zod";

export const updateCertificatesTypeSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(1, t("common.required")),
  });
