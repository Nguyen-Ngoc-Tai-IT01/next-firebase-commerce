"use client"
import React, { useMemo } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs'
import { ArrowDown, ArrowUp } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export interface IOrderProps {
	options?: string[]
}

const OrderData = ({ options }: IOrderProps) => {
	const searchParams = useSearchParams()
	const router = useRouter()
	const pathname = usePathname()
	const orderField = useMemo(() => searchParams.get("orderField") || "name", [searchParams])
	const orderType = useMemo(() => searchParams.get("orderType") || "desc", [searchParams])

	const onChangeOrderField = (value: string) => {
		const params = new URLSearchParams(searchParams.toString())
		params.set('orderField', value)
		router.push(`${pathname}?${params.toString()}`)
	}

	const onChangeOrderType = (value: string) => {
		const params = new URLSearchParams(searchParams.toString())
		params.set('orderType', value)
		router.push(`${pathname}?${params.toString()}`)
	}

	const orderOptions = options || [
		"name", "created_at", "updated_at"
	]

	return (
		<div className='flex gap-1'>
			<Select value={orderField} onValueChange={onChangeOrderField}>
				<SelectTrigger className="w-[140px]">
					<SelectValue placeholder="Theme" />
				</SelectTrigger>
				<SelectContent>
					{orderOptions.map((option) =>
						<SelectItem
							key={option}
							value={option}>
							{option.toUpperCase().split("_").join(" ")}
						</SelectItem>
					)}
				</SelectContent>
			</Select>
			<Tabs value={orderType} onValueChange={onChangeOrderType}>
				<TabsList>
					<TabsTrigger value="asc">
						<ArrowUp />
					</TabsTrigger>
					<TabsTrigger value="desc">
						<ArrowDown />
					</TabsTrigger>
				</TabsList>
			</Tabs>
		</div>
	)
}

export default OrderData