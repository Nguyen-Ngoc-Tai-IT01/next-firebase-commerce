"use client"
import React from 'react'
import { onAddAdmin } from './actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { ICreateAdminInput } from '@/features/managers/type'
import EditAdminForm from '../manager_form'


const CreateManager = () => {
	const router = useRouter()

	const onSubmit = async (formData: ICreateAdminInput) => {
		try {
			await onAddAdmin(formData)

			toast.info('Add manager successfully !');
			router.push("/admin/managers")
		} catch (error) {
			console.log("🚀 ~ onSubmit ~ error:", error)
			toast.error('Can not add manager !')
		}

	}
	return (
		<div >
			<h2 className='text-lg font-bold mb-8'>Create Manager</h2>
			< EditAdminForm onSubmit={onSubmit} />
		</div>
	)
}

export default CreateManager
