"use server"

import { createAdmin } from "@/features/managers/model"
import { ICreateAdminInput } from "@/features/managers/type"

export const onAddAdmin = async (data: ICreateAdminInput) => {
	try {
		await createAdmin(data)
		return {success: true}
	} catch (error) {
		return {success: false, message: (error as Error)}
	}

}