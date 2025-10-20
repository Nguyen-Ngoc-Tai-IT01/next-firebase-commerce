"use client"
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { IPaginationRes } from '@/features/type'
import { ICategoryDb } from '@/features/categories/type'
import "react-quill-new/dist/quill.snow.css";
import debounce from 'lodash-es/debounce'
import unionBy from 'lodash-es/unionBy'
import MultiSelectFormField from '@/components/ui/multi_select'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'



interface IProps {
	value?: string[]
	onChange?: (value: string[]) => void
}
const CategoriesSelect = ({ value = [], onChange }: IProps) => {
	const searchParams = useSearchParams()
	const router = useRouter()
	const pathname = usePathname()
	const [selectedIds, setSelectedIds] = useState(() => {
		const paramsCategories = searchParams.get('categories')
		if(paramsCategories){
			return paramsCategories.split(',')
		}
		return value
	})

	const [categories, setCategories] = useState<ICategoryDb[]>([])
	const fetchCategories = useCallback(async (keyword: string) => {
		try {
			const res = await fetch(`/api/admin/categories?keyword=${keyword}`)
			const data: IPaginationRes<ICategoryDb> = await res.json()
			setCategories((pre) => unionBy(pre.concat(data.data), "id"))
		} catch (error) {
			console.error("Fetch categories error:", error)
		}
	}, [])

	useEffect(() => {
		fetchCategories("")
	}, [fetchCategories])

	// Dùng useMemo để đảm bảo hàm này chỉ được tạo 1 LẦN
	const debounceSearch = useMemo(() => {
		return debounce((keyword: string) => {
			fetchCategories(keyword)
		}, 50)
	}, [fetchCategories])


	// Hủy debounce khi component bị unmount
	useEffect(() => {
		return () => {
			debounceSearch.cancel()
		}
	}, [debounceSearch])

	const onValueChange = (value: string[]) => {
		setSelectedIds(value)
		if (onChange) {
			onChange(value)
		} else {
			const params = new URLSearchParams(searchParams.toString())

			if (value) {
				params.set('categories', value.join(','))
			} else {
				params.delete('categories')
			}

			// navigate tới route mới để server component fetch lại dữ liệu
			router.push(`${pathname}?${params.toString()}`)
		}
	}

	
	return (
		<MultiSelectFormField
			placeholder="Categories"
			value={selectedIds}
			onValueChange={onValueChange}
			onSearch={(search) => {
				if (search) {
					debounceSearch(search)
				}
				return 1
			}}
			options={categories.map(c => ({ label: c.name, value: c.id })) || []}
		/>
	)
}

export default CategoriesSelect