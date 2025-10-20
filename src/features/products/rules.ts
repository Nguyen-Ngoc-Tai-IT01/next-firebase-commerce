import { z } from "zod";

export const AddProductSchema = z.object({
	name: z
		.string()
		.min(1, { message: "Product name is required" })
		.min(2, { message: "Product name must have at least 2 characters" }),

	slug: z
		.string()
		.min(1, { message: "Product slug is required" }),

	description: z
		.string()
		.min(50, { message: "Description must have at least 200 characters" }),

	images: z.array(z.string()).optional(),

	createdId: z.string()
		.min(1, { message: "Manager id is required" })
		.min(2, { message: "Manager id must have at least 2 characters" }),
	
	categoryIds: z.array(z.string()),

	properties: z.array(z.object({
		name: z.string(),
		color: z.string().optional(),
		size: z.string().optional(),
		price: z.number()
	})),

	defaultPrice: z.number().optional()
});

export const EditProductSchema = AddProductSchema.partial();
