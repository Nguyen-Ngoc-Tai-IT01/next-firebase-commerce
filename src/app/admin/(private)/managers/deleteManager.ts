"use server"

import { revalidatePath } from "next/cache"
import { deleteManagerById } from "@/features/managers/model"

export async function deleteManagerAction(id: string) {
  await deleteManagerById(id)
  revalidatePath("/admin/managers")
}
	