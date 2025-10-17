// features/managers/rules.ts
import z from "zod";

export const loginSchema = z.object({
    email: z.string().min(1, "Email is required").email('Email is invalid'),
    password: z.string().min(3, "Password must be at least 3 characters"),
}).required();

export const addAdminSchema = loginSchema.extend({
    isActive: z.boolean().default(true),
});

// Schema dùng khi edit admin: password optional, isActive optional
export const editAdminSchema = z.object({
    email: z.string().min(1, "Email is required").email("Email is invalid"),
    password: z.string().min(3, "Password must be at least 3 characters"),
    isActive: z.boolean(),
});
