import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { IAdminDb } from '@/features/managers/type'
import { Timestamp } from 'firebase/firestore'
import { Pencil } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { ActiveAdminAction, TableDeleteAction } from './table_actions'
import { deleteManagerAction } from './deleteManager'
import { updateActiveAdmin } from '@/features/managers/model'


interface IProps {
	data: IAdminDb[]
}
const onChangeActive = async (id: string, isActive: boolean) => {
	"use server"
	await updateActiveAdmin(id, isActive)
}

const ManagersTable = ({ data }: IProps) => {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Email</TableHead>
					<TableHead>Create At</TableHead>
					<TableHead>Edited At</TableHead>
					<TableHead>Active</TableHead>
					<TableHead className='w-28'>Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{data.map(admin =>
					<TableRow key={admin.id}>
						<TableCell className="font-medium">{admin.email}</TableCell>
						<TableCell>{(admin.created_at as unknown as Timestamp).toDate().toLocaleDateString("vi-VN")}</TableCell>
						<TableCell>{(admin.updated_at as unknown as Timestamp).toDate().toLocaleDateString("vi-VN")}</TableCell>
						<TableCell>
							<ActiveAdminAction
								isActive={admin.isActive ?? true}
								id={admin.id ?? ''}
								updateActiveAdmin={onChangeActive} />
						</TableCell>
						<TableCell>
							<div className='flex gap-4'>
								<Link href={"/admin/managers/edit/" + admin.id}>
									<Pencil className='w-5 h-5' />
								</Link>
								<TableDeleteAction id={admin.id ?? ''} deleteManagerById={deleteManagerAction} />
							</div>
						</TableCell>
					</TableRow>)}
			</TableBody>
		</Table>
	)
}

export default ManagersTable