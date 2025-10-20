"use client"
import React from 'react'
import { toast } from 'sonner'
import { onEditProduct } from './actions'
import { ICreateProductInput } from '@/features/products/type'
import FormProduct from '../../form'
import { useRouter } from 'next/navigation'; 

interface IProps {
    data: ICreateProductInput,
    id: string
}
const EditFormProduct = ({ data, id }: IProps) => {
    const router = useRouter(); 

    const onSubmit = async (formData: ICreateProductInput) => { 
        try {
            const result = await onEditProduct(id, formData); 
            if (result.success) {
                toast.info('Product update successful');
                router.push('/admin/products'); 
            } else {
                toast.error(result.error || 'Product update failed!');
            }
        } catch (error) {
            console.error("🚀 ~ onSubmit ~ error:", error);
            toast.error('Unable to update product!');
        }
    }

    return (
        <div>
            <h2 className='text-lg font-bold mb-8'>Edit product</h2>
            <FormProduct onSubmit={onSubmit} data={data} />
        </div>
    )
}

export default EditFormProduct