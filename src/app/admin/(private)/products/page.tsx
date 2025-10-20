import React, { Suspense } from 'react';

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/components/ui/card';
import TableHeader from '@/components/common/table-header';
import TablePagination from '@/components/common/table-pagination';
import ProductTable from './table';
import { getProducts } from '@/features/products/model';
import CategoriesSelect from './categories_select';

interface IProps {
	searchParams: ({ keyword?: string, page: string, orderField: string, orderType: 'asc' | 'desc' }) & { categories?: string };
}

const Product = async ({ searchParams }: IProps) => {
	const params = await searchParams
	const page = Number(params.page) || 1
	const keyword = params.keyword || ""
	const orderField = params.orderField || "created_at"
	const orderType = (params.orderType as 'asc' | 'desc') || "desc"
	const categoryIds = params.categories?.split(",") || []
	const res = await getProducts({ keyword, page, orderField, orderType, categoryIds })
	return (
		<div>

			<TableHeader addTitle='Add Product' addPath="/admin/products/new" />
			<div className='max-w-52 my-4'>
				<CategoriesSelect />
			</div>
			<Card x-chunk="dashboard-06-chunk-0">
				<CardHeader>
					<CardTitle>Products</CardTitle>
					<CardDescription>
						Manage your Products.
					</CardDescription>
				</CardHeader>
				<CardContent>
					{/* Dùng keyword đã xử lý */}
					<Suspense key={keyword}>
						<ProductTable data={res.data} />
					</Suspense>
				</CardContent>
				<CardFooter className='flex justify-end gap-4'>
					<div className="text-xs text-muted-foreground flex items-center gap-2">
						<div>
							Total: <strong>{res.meta.total}</strong> Products
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

export default Product;