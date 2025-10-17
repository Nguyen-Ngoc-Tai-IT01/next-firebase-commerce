"use client"
import { ConFirmDialog } from '@/components/ui/alert-dialog'
import { Switch } from '@/components/ui/switch'
import React from 'react'
import { toast } from 'sonner'


interface IProps {
	id: string,
	deleteManagerById: (id: string) => Promise<void>
}
export const TableDeleteAction = ({ id, deleteManagerById }: IProps) => {
	const onDelete = async () => {
		try {
			await deleteManagerById(id)
			toast.info("Delete manager successfully !")
		} catch (error) {
			console.log("🚀 ~ onDelete ~ error:", error)
			toast.info("Can not delete manager !")
		}
	}
	return (
		<ConFirmDialog
			title='Delete this manager ! '
			description='Do you want delete this manager ? '
			actionTitle='Delete'
			onConfirm={onDelete}
		/>
	)
}

export
	interface IActiveAdminActionProps {
	isActive: boolean
	id: string
	updateActiveAdmin: (id: string, isActive: boolean) => Promise<void>
}

export const ActiveAdminAction = ({
	isActive,
	id,
	updateActiveAdmin
}: IActiveAdminActionProps) => {
	const onChangeActive = async (check: boolean) => {
		try {
			await updateActiveAdmin(id , check)
			toast.info(check ? "Active manager successfully" : "Inactive manager successfully !")
		} catch (error) {
			console.log("🚀 ~ onDelete ~ error:", error)
			toast.info("Update false")
		}
	}
	return <Switch
		checked={isActive}
		onCheckedChange={onChangeActive}
	/>
}