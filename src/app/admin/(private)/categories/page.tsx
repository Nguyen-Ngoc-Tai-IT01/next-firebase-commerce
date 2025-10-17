import React, { Suspense } from 'react';
import CategoryTable from './table';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/components/ui/card';
import { getCategories } from "@/features/categories/model";
import TableHeader from '@/components/common/table-header';
import TablePagination from '@/components/common/table-pagination';

interface IProps {
	searchParams: ({ keyword?: string, page: string, orderField: string, orderType: 'asc' | 'desc' });
}

const Category = async ({ searchParams }: IProps) => {
	const params = await searchParams
	const page = Number(params.page) || 1
	const keyword = params.keyword || ""
	const orderField = params.orderField || "created_at"
	const orderType = (params.orderType as 'asc' | 'desc') || "desc"
	const res = await getCategories({ keyword, page, orderField, orderType })
	return (
		<div>
			<TableHeader addTitle='Add Category' addPath="/admin/categories/new" />
			<Card x-chunk="dashboard-06-chunk-0">
				<CardHeader>
					<CardTitle>Categories</CardTitle>
					<CardDescription>
						Manage your Categories.
					</CardDescription>
				</CardHeader>
				<CardContent>
					{/* Dùng keyword đã xử lý */}
					<Suspense key={keyword}>
						<CategoryTable data={res.data} />
					</Suspense>
				</CardContent>
				<CardFooter className='flex justify-end gap-4'>
					<div className="text-xs text-muted-foreground flex items-center gap-2">
						<div>
							Total: <strong>{res.meta.total}</strong> Categories
						</div>
						{res.meta.total > 5 && (
							<TablePagination total={res.meta.total} />
						)}
					</div>
				</CardFooter>
			</Card>
		</div>
	);
};

export default Category;