// file: action.tsx
"use server";

import { revalidatePath } from "next/cache";
import { editManager } from "@/features/managers/model";
import { ICreateAdminInput } from "@/features/managers/type";

export const onEditManager = async (id: string, data: ICreateAdminInput) => {
    try {
        await editManager(id, data);
        revalidatePath("/admin/managers");

        // Khi thành công, trả về tín hiệu này
        return { success: true }; 
    } catch (error) {
        console.error(error);
        // Khi có lỗi, trả về tín hiệu này
        return { success: false, error: "Can not add manager !" };
    }
};