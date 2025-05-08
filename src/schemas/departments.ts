import { z } from "zod";

export const departmentSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  description: z.string().optional(),
  status: z.string().min(1, "Status is required"),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const createDepartmentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  description: z.string().optional(),
  status: z.string().min(1, "Status is required"),
});

export const updateDepartmentSchema = createDepartmentSchema.extend({
  id: z.string().min(1, "ID is required"),
});
