"use client"
import React from 'react'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { AddCategorySchema } from '@/features/categories/rules'
import { Button } from '@/components/ui/button'
import { ICreateCategoryInput } from '@/features/categories/type'


interface IProps {
	data?: ICreateCategoryInput,
	onSubmit: (data: ICreateCategoryInput) => void
}
const FormCategory = ({ data, onSubmit }: IProps) => {
	const form = useForm<ICreateCategoryInput>({
		resolver: zodResolver(AddCategorySchema),
		defaultValues: {
			name: data?.name || "",
			slug: data?.slug || "",
			description: data?.description || "",
			images: data?.images || []  // đảm bảo là string[]
		}
	})

	return (
		<div >
			<Form {...form}>
				<form className="flex flex-col gap-5 bg-white p-6 rounded-xl shadow-md"
					onSubmit={form.handleSubmit(onSubmit)}>
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Category Name</FormLabel>
								<FormControl>
									<Input placeholder="category 1" {...field} />
								</FormControl>
								<FormDescription>This is category display name.</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="slug"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Category slug</FormLabel>
								<FormControl>
									<Input placeholder="category slug" {...field} />
								</FormControl>
								<FormDescription>This is category slug(using for url).</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Category description</FormLabel>
								<FormControl>
									<Input placeholder="categpry description" {...field} />
								</FormControl>
								<FormDescription>This is category display name.</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type='submit' disabled={!form.formState.isValid}>Add Category</Button>
				</form>
			</Form>
		</div>
	)
}

export default FormCategory
