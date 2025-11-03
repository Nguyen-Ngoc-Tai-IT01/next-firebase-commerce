"use server"

import { addProduct } from "@/features/products/model"
import { ICreateProductInput } from "@/features/products/type"
import { revalidatePath } from "next/cache"
import { AddProductFormSchema } from "@/features/products/rules" // Import schema form
import { z } from "zod"
import { getServerSession } from "next-auth" // Import session
import { authOptions } from "@/app/api/auth/[...nextauth]/route" // Import authOptions

type IProductFormInput = z.infer<typeof AddProductFormSchema>;

export const onAddProduct = async (data: IProductFormInput) => { 
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) { 
            throw new Error("Người dùng chưa đăng nhập hoặc thiếu ID.");
        }
        const managerId = session.user.id; 

        const fullProductData: ICreateProductInput = {
            ...data,
            createdId: managerId 
        };

        await addProduct(fullProductData); 

        revalidatePath("/admin/products");
        return { success: true };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Lỗi khi thêm sản phẩm:", error);
        return { success: false, error: error.message || "Không thể thêm sản phẩm." };
    }
}