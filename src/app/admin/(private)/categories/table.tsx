import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ICategoryDb } from '@/features/categories/type'
import { Timestamp } from 'firebase/firestore'
import { Pencil } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import TableDeleteAction from './table_delete_action'
import { deleteCategoryAction } from './deleteCategory'

interface IProps {
	data: ICategoryDb[]
}

const CategoryTable = ({ data }: IProps) => {

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>name</TableHead>
					<TableHead>Slug</TableHead>
					<TableHead>Create At</TableHead>
					<TableHead>Edited At</TableHead>
					<TableHead className='w-28'>Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{data.map(category =>
					<TableRow key={category.id}>
						<TableCell className="font-medium">{category.name}</TableCell>
						<TableCell>{category.slug}</TableCell>
						<TableCell>{(category.created_at as Timestamp).toDate().toLocaleDateString("vi-VN")}</TableCell>
						<TableCell>{(category.updated_at as Timestamp).toDate().toLocaleDateString("vi-VN")}</TableCell>
						<TableCell>
							<div className='flex gap-4'>
								<Link href={"/admin/categories/edit/" + category.id}>
									<Pencil className='w-5 h-5' />
								</Link>
								<TableDeleteAction id={category.id} deleteCategoryById={deleteCategoryAction} />
							</div>
						</TableCell>
					</TableRow>)}
			</TableBody>
		</Table>
	)
}

export default CategoryTable