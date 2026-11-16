import { z } from "zod";

export const accountNameSchema = z.object({
  first_name: z.string().trim().min(1, "First name is required").max(50, "First name must be 50 characters or fewer"),
  last_name: z.string().trim().max(50, "Last name must be 50 characters or fewer"),
});