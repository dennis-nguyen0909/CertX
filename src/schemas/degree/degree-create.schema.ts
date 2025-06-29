import * as z from "zod";

export const degreeCreateSchema = (t: (key: string) => string) =>
  z.object({
    studentId: z.number().min(1, t("degrees.validation.studentIdRequired")),
    ratingId: z.number().min(1, t("degrees.validation.ratingIdRequired")),
    degreeTitleId: z
      .number()
      .min(1, t("degrees.validation.degreeTitleIdRequired")),
    educationModeId: z
      .number()
      .min(1, t("degrees.validation.educationModeIdRequired")),
    issueDate: z.string().min(1, t("degrees.validation.issueDateRequired")),
    graduationYear: z
      .string()
      .min(1, t("degrees.validation.graduationYearRequired")),
    trainingLocation: z
      .string()
      .min(1, t("degrees.validation.trainingLocationRequired")),
    signer: z.string().min(1, t("degrees.validation.signerRequired")),
    diplomaNumber: z
      .string()
      .min(1, t("degrees.validation.diplomaNumberRequired")),
    lotteryNumber: z
      .string()
      .min(1, t("degrees.validation.lotteryNumberRequired")),
    ratingName: z.string().optional(),
  });
