"use client"
import { Radio, RadioGroup } from "@headlessui/react"
import React, { useEffect, useState } from "react"
import { cn } from "@/lib/utils";
import { IProperties } from "@/features/products/type";
import { uniq } from "lodash-es";

interface IProps {
	properties: IProperties[]
}

const AddToCartForm = ({ properties }: IProps) => {
	const [selectedColor, setSelectedColor] = useState<string>();
	const [selectedSize, setSelectedSize] = useState<string>();
	const [selectProperty, setSelectProperty] = useState<IProperties>()

	const colors = uniq(properties.map(({ color }) => color?.toLowerCase()))
	const sizes = uniq(properties.map(({ size }) => size?.toLowerCase()))

	useEffect(() => {
		const initProperty = properties[0]
		if(initProperty){
			setSelectedColor(initProperty.color || '')
			setSelectedSize(initProperty.size || '')
		}
	}, [properties])


	useEffect(() => {
	  const propertyMatchColor = properties.filter(
		(p) => p.color?.toLocaleLowerCase() === selectedColor 
	  )
	  let property = propertyMatchColor.find(
		(p) => p.size?.toLocaleLowerCase() === selectedSize
	  )
	  if(!property){
		property = propertyMatchColor[0]
		setSelectedSize(property?.size || "")
	  }
	  if (property){
		setSelectProperty(property)
	  }
	}, [properties,selectedColor, selectedSize])
	return (
		<form className="mt-10">
			{/* Colors */}
			<div>
				<h3 className="text-sm font-medium text-gray-900">Color</h3>
				<RadioGroup
					value={selectedColor}
					onChange={setSelectedColor}
					className="mt-4"
				>
					<RadioGroup.Label className="sr-only">Choose a color</RadioGroup.Label>
					<div className="flex items-center space-x-3">
						{colors.map((color) => (
							<Radio
								key={color}
								value={color}
								aria-label={color}
								className={cn(
									"relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none data-[checked]:ring-2 data-[focus]:data-[checked]:ring data-[focus]:data-[checked]:ring-offset-1"
								)}
							>
								<span
									aria-hidden="true"
									style={{ backgroundColor: color }}
									className={cn(
										'h-8 w-8 rounded-full border border-black border-opacity-10'
									)}
								/>
							</Radio>
						))}
					</div>
				</RadioGroup>
			</div>

			{/* Sizes */}
			<div className="mt-10">
				<div className="flex items-center justify-between">
					<h3 className="text-sm font-medium text-gray-900">Size</h3>
					<a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
						Size guide
					</a>
				</div>
				<RadioGroup
					value={selectedSize}
					onChange={setSelectedSize}
					className="mt-4"
				>
					<RadioGroup.Label className="sr-only">Choose a size</RadioGroup.Label>
					<div className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4">
						{sizes.map((size) => (
							<Radio
								key={size}
								value={size}
								className={cn(
									"cursor-pointer bg-white text-gray-900 shadow-sm",
									"group relative flex items-center justify-center rounded-md border px-4 py-3 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none data-[focus]:ring-2 data-[focus]:ring-indigo-500 sm:flex-1 sm:py-6"
								)}
							>
								<span>{size}</span>
								{size ? (
									<span
										aria-hidden="true"
										className="pointer-events-none absolute -inset-px rounded-md border-2 border-transparent group-data-[focus]:border group-data-[checked]:border-indigo-500"
									/>
								) : (
									<span
										aria-hidden="true"
										className="pointer-events-none absolute -inset-px rounded-md border-2 border-gray-200"
									>
										<svg
											stroke="currentColor"
											viewBox="0 0 100 100"
											preserveAspectRatio="none"
											className="absolute inset-0 h-full w-full stroke-2 text-gray-200"
										>
											<line
												x1={0}
												x2={100}
												y1={100}
												y2={0}
												vectorEffect="non-scaling-stroke"
											/>
										</svg>
									</span>
								)}
							</Radio>
						))}
					</div>
				</RadioGroup>
			</div >

			<button
				type="submit"
				className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
			>
				Add to bag
			</button>
		</form >
	)
}

export default AddToCartForm