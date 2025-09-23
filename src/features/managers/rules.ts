import z from "zod";

export const loginSchema = z.object({
    email: z.string().min(1, "Email in required").email('Email is invalid'),
    password: z.string().min(3, {
        message: "Password must be at least 3 characters "
    })
        
}).required()
