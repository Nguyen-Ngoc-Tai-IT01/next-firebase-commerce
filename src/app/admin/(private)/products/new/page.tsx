"use client"
import React from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import FormProduct from '../form'
import { onAddProduct } from '../action'
import { AddProductFormSchema } from '@/features/products/rules' // Import schema
import { z } from 'zod' // Import z

// 🔥 Tạo kiểu dữ liệu mới
type IProductFormInput = z.infer<typeof AddProductFormSchema>;

const CreateProduct = () => {
    const router = useRouter()
    
    // 🔥 Sửa kiểu dữ liệu của 'data' ở đây
    const onSubmit = async (data: IProductFormInput) => {
        try {
            // 'data' bây giờ không chứa 'createdId'
            const result = await onAddProduct(data); 

            if (result.success) {
                toast.info('Add product successfully !');
                router.push("/admin/products");
            } else {
                toast.error(result.error || 'Can not add product !');
            }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.log("🚀 ~ onSubmit ~ error:", error)
            toast.error(error.message || 'Can not add product !')
        }
    }
    return (
        <div >
			<h2 className='text-lg font-bold mb-8'>Create Product</h2>
           <FormProduct onSubmit={onSubmit}/>
        </div>
    )
}

export default CreateProduct