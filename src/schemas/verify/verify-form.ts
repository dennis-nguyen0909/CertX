import { z } from "zod";

export const verifyFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export type VerifyFormData = z.infer<typeof verifyFormSchema>;
