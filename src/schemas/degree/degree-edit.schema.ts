import * as z from "zod";

export const degreeEditSchema = z.object({
  ratingId: z.number().min(1, "Rating is required"),
  degreeTitleId: z.number().min(1, "Degree title is required"),
  educationModeId: z.number().min(1, "Education mode is required"),
  issueDate: z.string().min(1, "Issue date is required"),
  graduationYear: z.string().min(1, "Graduation year is required"),
  signer: z.string().min(1, "Signer is required"),
  diplomaNumber: z.string().min(1, "Diploma number is required"),
  lotteryNumber: z.string().min(1, "Lottery number is required"),
  ratingName: z.string().optional(),
});
