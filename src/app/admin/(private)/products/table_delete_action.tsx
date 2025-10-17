"use client"
import { ConFirmDialog } from '@/components/ui/alert-dialog'
import React from 'react'
import { toast } from 'sonner'


interface IProps {
	id: string,
	deleteProductById: (id: string) => Promise<void>
}
const TableDeleteAction = ({ id, deleteProductById }: IProps) => {
	const onDelete = async () => {
		try {
			await deleteProductById(id)
			toast.info("Delete product successfully !")
		} catch (error) {
			console.log("🚀 ~ onDelete ~ error:", error)
			toast.info("Can not delete product !")
		}
	}
	return (
		<ConFirmDialog
			title='Delete this product ! '
			description='Do you want delete this product ? '
			actionTitle='Delete'
			onConfirm={onDelete}
		/>
	)
}

export default TableDeleteAction