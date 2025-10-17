import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { BASE_URL } from '@/constants/common';
import React, { useState } from 'react'


interface IProps {
	onChange: (images: string[]) => void
}
const Upload = ({ onChange }: IProps) => {
	const [images, setImages] = useState([])
	const onUploadImageProduct = async (file: File) => {
		const formData = new FormData()
		formData.append("image", file)
		fetch(`${BASE_URL}/api/admin/products/image`, { method: "POST", body: formData })
			.then((res => res.json()))
			.then((data) => {
				setImages((pre) => {
					const img = pre.concat(data.image)
				onChange(img)
				return img
				})	
			})
	}
	return (
		<div>
			<Input
				type="file"
				name="image"
				accept="image/*"
				onChange={async (e) => {
					if (e.target.files) {
						await onUploadImageProduct(e.target.files[0])
					}
				}}
			/>
			<div className='flex gap-2'>
				{images.map((img) => (
					<Image
						height={140}
						width={140}
						src={img}
						alt="Product image"
						key={img}
						className="rounded shadow"
					/>
				))}
			</div>
		</div>
	)
}

export default Upload