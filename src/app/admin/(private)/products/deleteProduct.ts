"use server"

import { deleteProductById } from "@/features/products/model"
import { revalidatePath } from "next/cache"

export async function deleteProductAction(id: string) {
  await deleteProductById(id)
  revalidatePath("/admin/categories")
}
