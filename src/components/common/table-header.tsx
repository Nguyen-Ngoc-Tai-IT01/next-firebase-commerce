import OrderData, { IOrderProps } from '@/components/common/order_data'
import SearchBar from '@/components/common/search'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

interface IProps extends IOrderProps {
	addTitle: string
	addPath: string
}
const TableHeader = ({ addTitle, options, addPath }: IProps) => {
	return (
		<div className='mb-6'>
			<div className="flex items-center gap-2">
				<SearchBar />
				<OrderData options={options} />
				<div className="ml-auto flex items-center gap-2">
					<Button size="sm" className="h-8 gap-1">
						<PlusCircle className="h-3.5 w-3.5" />
						<Link href={addPath}
							className="sr-only sm:not-sr-only sm:whitespace-nowrap">
							{addTitle}
						</Link>
					</Button>
				</div>
			</div>
		</div>
	)
}

export default TableHeader 