"use server"

import { editCategory } from "@/features/categories/model"
import { ICreateCategoryInput } from "@/features/categories/type"
import { redirect } from "next/navigation"

export const onEditCategory = async (id: string, data: ICreateCategoryInput) => {
	await editCategory(id, data)
	redirect("/admin/categories");
}