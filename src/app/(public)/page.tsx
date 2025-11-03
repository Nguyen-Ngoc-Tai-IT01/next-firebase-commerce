import React from 'react'
import Image from "next/image"
import { getProducts } from '@/features/products/model';
import { Badge} from 'lucide-react';
import Link from 'next/link';

interface IProps {
	searchParams: ({ keyword?: string, page: string, orderField: string, orderType: 'asc' | 'desc' }) & { categories?: string };
}
const Page = async ({searchParams}: IProps) => {
	const params = await searchParams
		const page = Number(params.page) || 1
		const keyword = params.keyword || ""
		const orderField = params.orderField || "created_at"
		const orderType = (params.orderType as 'asc' | 'desc') || "desc"
		const categoryIds = params.categories?.split(",") || []
		const res = await getProducts({ keyword, page, orderField, orderType, categoryIds })
	return (
		<div className="bg-white">
			<div className="mx-auto max-w-2xl lg:max-w-7xl">
				<h2 className="text-2xl font-bold tracking-tight text-gray-900">
					All product
				</h2>
				<div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
					{res.data.map((product, i) => (
						<div className="group relative" key={i}>
							<Image
								width={224}
								height={320}
								src={product.images ? product.images[0] : ""}
								alt={product.name}
								className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
							/>
							<div className="mt-4 flex justify-between">
								<div>
									<h3 className="text-sm text-gray-700">
										<Link href={`/p/${product.slug}`}>
											<span aria-hidden="true" className="absolute inset-0" />
											{product.name}
										</Link>
									</h3>
									<div className="mt-1 text-sm text-gray-500">
										{product.properties?.map((p) => (
											<Badge key={p.name}>{p.color || p.size || p.name}</Badge>
										))}
									</div>
								</div>
								<p className="text-sm font-medium text-gray-900">
									${product.defaultPrice || product.properties[0]?.price}
									</p>
							</div>
						</div>

					))}

				</div>
			</div>
		</div>

	)
}

export default Page