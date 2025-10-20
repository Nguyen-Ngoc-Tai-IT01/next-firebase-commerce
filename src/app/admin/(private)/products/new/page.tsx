"use client"
import React from 'react'
import { ICreateProductInput } from '@/features/products/type'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import FormProduct from '../form'
import { onAddProduct } from '../action'


const CreateProduct = () => {
	const router = useRouter()

	const onSubmit = async (data: ICreateProductInput) => {
		try {
			await onAddProduct(data)

			toast.info('Add category successfully !');
			router.push("/admin/products")
		} catch (error) {
			console.log("🚀 ~ onSubmit ~ error:", error)
			toast.error('Can not add category !')
		}

	}
	return (
		<div >
			<h2 className='text-lg font-bold mb-8'>Create Product</h2>
			<FormProduct onSubmit={onSubmit} />
		</div>
	)
}

export default CreateProduct
