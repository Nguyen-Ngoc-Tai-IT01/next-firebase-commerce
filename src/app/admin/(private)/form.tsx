"use client"
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { ICreateProductInput } from '@/features/products/type'
import { AddProductSchema } from '@/features/products/rules'
import MultiSelect from '@/components/ui/multi_select'
import { BASE_URL } from '@/constants/common'
import { IPaginationRes } from '@/features/type'
import { ICategoryDb } from '@/features/categories/type'
import Upload from './products/upload'
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";



const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface IProps {
	data?: ICreateProductInput,
	onSubmit: (data: ICreateProductInput) => void
}
const FormProduct = ({ data, onSubmit }: IProps) => {
	const [categories, setCategories] = useState<ICategoryDb[]>([])

	const fetchCategories = async (keyword: string) => {
		try {
			const res = await fetch(`${BASE_URL}/api/admin/categories?keyword=${keyword}`)
			const data: IPaginationRes<ICategoryDb> = await res.json()
			setCategories(data.data)
		} catch (error) {
			console.error("Fetch categories error:", error)
		}
	}
	const form = useForm<ICreateProductInput>({
		resolver: zodResolver(AddProductSchema),
		mode: 'onChange',
		defaultValues: {
			name: data?.name || "",
			slug: data?.slug || "",
			description: data?.description || "",
			images: data?.images || [],  // đảm bảo là string[]
			defaultPrice: data?.defaultPrice || 0,
			categoryIds: data?.categoryIds || [],
			createdId: "YFNJIoJJYR1siROBVyY5", // chỉ lưu ID string, không phải object
			properties: data?.properties || [],
		}
	})

	useEffect(() => {
		fetchCategories("");
	}, [])


	return (
		<div >
			<Form {...form}>
				<form  className="flex flex-col gap-5 bg-white p-6 rounded-xl shadow-md"
					onSubmit={form.handleSubmit(onSubmit)}>
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Product Name</FormLabel>
								<FormControl>
									<Input placeholder="Product 1" {...field} />
								</FormControl>
								<FormDescription>This is productdisplay name.</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="slug"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Product slug</FormLabel>
								<FormControl>
									<Input placeholder="Product slug" {...field} />
								</FormControl>
								<FormDescription>This is product slug(using for url).</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Product description</FormLabel>
								<FormControl>
									<ReactQuill theme="snow" {...field}/>
									{/* <Input placeholder="Product description" {...field} /> */}
								</FormControl>
								<FormDescription>This is product display name.</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="defaultPrice"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Product default price</FormLabel>
								<FormControl>
									<Input
										type='number'
										placeholder="10.000 VND"
										{...field}
										onChange={(v) => field.onChange(Number(v.target.value))}
									/>
								</FormControl>
								<FormDescription>This is product default price.</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="categoryIds"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Product categories</FormLabel>
								<FormControl>
									<MultiSelect
										placeholder="Select categories"
										defaultValue={field.value || []}
										onValueChange={(ids) => field.onChange(ids)}
										options={categories.map(c => ({ label: c.name, value: c.id })) || []}
									/>
								</FormControl>
								<FormDescription>This is product categories.</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="images"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Product categories</FormLabel>
								<FormControl>
									<Upload
										onChange={(images) => field.onChange(images)}
									/>
								</FormControl>
								<FormDescription>This is product categories.</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type='submit' disabled={!form.formState.isValid}>Add Product</Button>
				</form>
			</Form>

		</div>
	)
}

export default FormProduct
