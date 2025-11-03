import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Timestamp } from 'firebase/firestore'
import { Pencil } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { IProductDb } from '@/features/products/type'
import TableDeleteAction from './table_delete_action'
import { deleteProductAction } from './deleteProduct'
import { Badge } from '@/components/ui/badge'

interface IProps {
	data: IProductDb[]
}

const ProductTable = ({ data }: IProps) => {

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>name</TableHead>
					<TableHead>Slug</TableHead>
					<TableHead>Created By</TableHead>
					<TableHead>Categories</TableHead>
					<TableHead>Default price</TableHead>
					<TableHead>Created At</TableHead>
					<TableHead>Edited At</TableHead>
					<TableHead className='w-28'>Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{data.map(product =>
					<TableRow key={product.id}>
						<TableCell className="font-medium">{product.name}</TableCell>
						<TableCell>{product.slug}</TableCell>
						<TableCell>{product.created_by?.email}</TableCell>
						<TableCell>
							<div className='flex gap-2'>
								{product.categories.map(c => <Badge key={c.id}>{c.name}</Badge>)}
							</div>
						</TableCell>
						<TableCell>{product.defaultPrice}</TableCell>
						<TableCell>{(product.created_at as Timestamp).toDate().toLocaleDateString("vi-VN")}</TableCell>
						<TableCell>{(product.updated_at as Timestamp).toDate().toLocaleDateString("vi-VN")}</TableCell>
						<TableCell>
							<div className='flex gap-4'>
								<Link href={"/admin/products/edit/" + product.id}>
									<Pencil className='w-5 h-5' />
								</Link>
								<TableDeleteAction id={product.id} deleteProductById={deleteProductAction} />
							</div>
						</TableCell>
					</TableRow>)}
			</TableBody>
		</Table>
	)
}

export default ProductTable