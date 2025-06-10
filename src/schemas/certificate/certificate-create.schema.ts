import { z } from "zod";

export const createCertificateSchema = (t: (key: string) => string) =>
  z.object({
    studentId: z.number().min(1, t("common.required")),
    certificateTypeId: z.number().min(1, t("common.required")),
    grantor: z.string().min(1, t("common.required")),
    signer: z.string().min(1, t("common.required")),
    issueDate: z.string().min(1, t("common.required")),
    diplomaNumber: z.string().min(1, t("common.required")),
  });

export type CreateCertificateData = z.infer<
  ReturnType<typeof createCertificateSchema>
>;
