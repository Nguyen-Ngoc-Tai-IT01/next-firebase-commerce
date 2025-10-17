"use client"
import React from 'react'
import { ICreateCategoryInput } from '@/features/categories/type'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import FormCategory from '../category_form'
import { onAddCategory } from './action'


const CreateCategory = () => {
    const router = useRouter()
    
    const onSubmit = async ({ name, description, slug }: ICreateCategoryInput) => {
        try {
            await onAddCategory({
                name,
                description,
                slug,
                images: []
            })

        toast.info('Add category successfully !');
        router.push("/admin/categories")
        } catch (error) {
            console.log("🚀 ~ onSubmit ~ error:", error)
            toast.error('Can not add category !')
        }
        
    }
    return (
        <div >
			<h2 className='text-lg font-bold mb-8'>Create Category</h2>
           <FormCategory onSubmit={onSubmit}/>
        </div>
    )
}

export default CreateCategory
