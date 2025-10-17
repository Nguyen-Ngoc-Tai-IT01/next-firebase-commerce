import React from 'react'
import { getManagerById } from '@/features/managers/model'
import EditFormManager from './edit_form'

interface IProps {
  params: { id: string }
}

const EditManager = async ({ params }: IProps) => {
  const { id } = await params
  const detailData = await getManagerById(id)

  return detailData && <EditFormManager data={detailData} id={id} />
}

export default EditManager
