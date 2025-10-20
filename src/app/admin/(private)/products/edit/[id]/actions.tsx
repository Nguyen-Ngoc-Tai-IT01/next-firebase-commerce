// file: action.tsx
"use server";

import { revalidatePath } from "next/cache";
import { editProduct } from "@/features/products/model";
import { ICreateProductInput } from "@/features/products/type";

export const onEditProduct = async (id: string, data: ICreateProductInput) => {
    try {
        await editProduct(id, data);
        revalidatePath("/admin/products");

        // Khi thành công, trả về tín hiệu này
        return { success: true }; 
    } catch (error) {
        console.error(error);
        // Khi có lỗi, trả về tín hiệu này
        return { success: false, error: "Can not add product !" };
    }
};