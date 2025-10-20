import React from 'react'
import { getProductById } from '@/features/products/model'
import EditFormProduct from './edit_form'
import { notFound } from 'next/navigation'
import { ICreateProductInput } from '@/features/products/type'

interface IProps {
  params: { id: string }
}

const EditProduct  = async ({ params }: IProps) => {
  const { id } =  await params
  const detailData = await getProductById(id)

  if (!detailData) {
    return notFound();
  }
  const createdById = detailData.created_by?.id; 
  if (!createdById) {
      throw new Error(`Product data is corrupted: missing created_by ID for product ${id}`);
  }

  const dataForForm: ICreateProductInput = {
      // Lấy từ detailData, không gán rỗng
      name: detailData.name || '',
      slug: detailData.slug || '',
      description: detailData.description || '',
      images: detailData.images || [], 
      defaultPrice: detailData.defaultPrice || 0, 
      properties: detailData.properties || [],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      categoryIds: detailData.categories.map((c: any) => c.id),
      createdId: createdById,
  };

  return <EditFormProduct data={dataForForm} id={id} />
}

export default EditProduct 
