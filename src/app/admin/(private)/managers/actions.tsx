"use server"

import { addCategory } from "@/features/categories/model"
import { ICreateCategoryInput } from "@/features/categories/type"

export const onAddCategory = async (data: ICreateCategoryInput) => {
    await addCategory(data)
}