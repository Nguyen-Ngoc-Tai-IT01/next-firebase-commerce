import { z } from "zod";

export const AddCategorySchema = z.object({
  name: z
    .string()
    .min(1, { message: "Category name is required" })
    .min(2, { message: "Category name must have at least 2 characters" }),

  slug: z
    .string()
    .min(1, { message: "Category slug is required" }),

  description: z
    .string()
    .min(50, { message: "Description must have at least 200 characters" }),

  images: z.array(z.string()).optional(),
});
