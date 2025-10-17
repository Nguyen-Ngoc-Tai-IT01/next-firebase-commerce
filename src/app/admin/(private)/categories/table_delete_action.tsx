"use client"
import { ConFirmDialog } from '@/components/ui/alert-dialog'
import React from 'react'
import { toast } from 'sonner'


interface IProps {
	id: string,
	deleteCategoryById: (id: string) => Promise<void>
}
const TableDeleteAction = ({ id, deleteCategoryById }: IProps) => {
	const onDelete = async () => {
		try {
			await deleteCategoryById(id)
			toast.info("Delete category successfully !")
		} catch (error) {
			console.log("🚀 ~ onDelete ~ error:", error)
			toast.info("Can not delete category !")
		}
	}
	return (
		<ConFirmDialog
			title='Delete this category ! '
			description='Do you want delete this category ? '
			actionTitle='Delete'
			onConfirm={onDelete}
		/>
	)
}

export default TableDeleteAction