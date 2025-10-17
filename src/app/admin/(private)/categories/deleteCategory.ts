"use server"

import { revalidatePath } from "next/cache"
import { deleteCategoryById } from "@/features/categories/model"

export async function deleteCategoryAction(id: string) {
  await deleteCategoryById(id)
  revalidatePath("/admin/categories")
}
