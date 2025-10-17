import React, { Suspense } from 'react'
import { getManagers } from '@/features/managers/model'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import TablePagination from '../../../../components/common/table-pagination';
import TableHeader from '@/components/common/table-header';
import ManagersTable from './table';

interface IProps {
	searchParams: ({ keyword?: string, page: string, orderField: string, orderType: 'asc' | 'desc' });
}
const page = async ({ searchParams }: IProps) => {
	const params = await searchParams
	const page = Number(params.page) || 1
	const keyword = params.keyword || ""
	const orderField = params.orderField || "created_at"
	const orderType = (params.orderType as 'asc' | 'desc') || "desc"
	const res = await getManagers({ keyword, page, orderField, orderType })
	return (
		<div>
			<TableHeader
				addTitle=" Add Manager"
				options={["email", "created_at", "updated_at"]} 
				addPath="/admin/managers/new"
				/>
			<Card x-chunk="dashboard-06-chunk-0">
				<CardHeader>
					<CardTitle>Managers</CardTitle>
					<CardDescription>
						Manager your manager (Admin accounts).
					</CardDescription>
				</CardHeader>
				<CardContent>
					{/* Dùng keyword đã xử lý */}
					<Suspense key={keyword}>
						<ManagersTable data={res.data} />
					</Suspense>
				</CardContent>
				<CardFooter className='flex justify-end gap-4'>
					<div className="text-xs text-muted-foreground flex items-center gap-2">
						<div>
							Total: <strong>{res.meta.total}</strong> Managers
						</div>
						{res.meta.total > 5 && (
							<TablePagination total={res.meta.total} />
						)}
					</div>
				</CardFooter>
			</Card>
		</div>
	);
}

export default page