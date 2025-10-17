"use client"
import React from 'react'
import { ICreateCategoryInput } from '@/features/categories/type'
import { toast } from 'sonner'
import FormCategory from '../../category_form'
import { onEditCategory } from './actions'

interface IProps {
	data: ICreateCategoryInput,
	id: string
}
const EditFormCategory = ({ data, id }: IProps) => {

	const onSubmit = async ({ name, description, slug }: ICreateCategoryInput) => {
		try {
			await onEditCategory(id, {
				name,
				description,
				slug,
				images: []
			})

			toast.info('Add category successfully !');
		} catch (error) {
			console.log("🚀 ~ onSubmit ~ error:", error)
			toast.error('Can not add category !')
		}

	}
	return (
		<div >
			<h2 className='text-lg font-bold mb-8'>Create Category</h2>
			<FormCategory onSubmit={onSubmit} data={data} />
		</div>
	)
}

export default EditFormCategory
