import { z } from "zod";

export const registerFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  email: z.string().email("Invalid email address"),
  taxCode: z.string().min(1, "Tax code is required"),
  website: z.string().url("Invalid website URL"),
  logo: z.string().min(1, "Logo is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type RegisterFormData = z.infer<typeof registerFormSchema>;
