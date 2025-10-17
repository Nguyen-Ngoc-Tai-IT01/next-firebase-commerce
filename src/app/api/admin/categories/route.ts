import { getCategories } from "@/features/categories/model"
import { NextRequest, NextResponse } from "next/server"

export const GET = async (req: NextRequest) => {
	const keyword = (await req.nextUrl.searchParams.get("keyword")) || ""
	const categories =  await getCategories({
		keyword,
		page: 0,
		orderField: "name",
		orderType: "asc",
		size: 20
	})
	return NextResponse.json(categories)
}