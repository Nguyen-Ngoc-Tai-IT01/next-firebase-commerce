import React from 'react'
import { getCategoryById } from '@/features/categories/model'
import EditFormCategory from './edit_form'

interface IProps {
  params: { id: string }
}

const EditCategory = async ({ params }: IProps) => {
  const { id } = await params
  const detailData = await getCategoryById(id)

  return detailData && <EditFormCategory data={detailData} id={id} />
}

export default EditCategory
