import {
	addDoc,
	getDoc,
	getDocs,
	query,
	where,
	collection,
	Timestamp,
	orderBy,
	endAt,
	startAt,
	getCountFromServer,
	limit,
	startAfter,
	doc,
	updateDoc,
	deleteDoc,
	documentId,
} from "firebase/firestore"
import { db } from "@/utils/firebase"
import {
	ICategoryDb,
	ICategoryDoc,
	ICreateCategoryInput,
} from "@/features/categories/type"
import { AddCategorySchema } from "@/features/categories/rules"
import { formatZodMessage } from "@/utils/common/zod"
import { IGetDataInput, IPaginationRes } from "../type"
import { getLastVisibleDoc } from "@/utils/common/queries"

const categoriesRef = collection(db, "categories")

// Lấy category theo slug
export const getCategoryBySlug = async (slug: string) => {
	const existedCategory = await getDocs(
		query(categoriesRef, where("slug", "==", slug))
	)

	if (!existedCategory.docs[0]) {
		return undefined
	}
	const category = existedCategory.docs[0].data() as ICategoryDoc
	return {
		...category,
		id: existedCategory.docs[0].id,
	}
}

export const addCategory = async (
	data: ICreateCategoryInput
): Promise<ICategoryDb> => {
	const test = AddCategorySchema.safeParse(data)
	if (!test.success) {
		const message = formatZodMessage(test.error)
		throw Error(message)
	}

	const existedCategory = await getCategoryBySlug(data.slug)
	if (existedCategory) {
		throw Error("Slug have been used!")
	}

	const newCateRef = await addDoc(categoriesRef, {
		...data,
		nameLower: data.name.toLowerCase(),
		deleted_at: "",
		created_at: Timestamp.now(),
		updated_at: Timestamp.now(),
	})

	const newCategory = await getDoc(newCateRef)

	return { id: newCategory.id, ...(newCategory.data() as ICategoryDoc) }
}

export const editCategory = async (
	id: string,
	data: ICreateCategoryInput
): Promise<ICategoryDb> => {
	const test = AddCategorySchema.safeParse(data)
	if (!test.success) {
		const message = formatZodMessage(test.error)
		throw Error(message)
	}

	const oldCategory = await getDoc(doc(categoriesRef, id))
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	if (oldCategory.exists() && data.slug !== (oldCategory.data() as any)?.slug) {
		const existedCategory = await getCategoryBySlug(data.slug)
		if (existedCategory) {
			throw Error("Slug have been used!")
		}

	}

	await updateDoc(doc(categoriesRef, id), {
		...data,
		nameLower: data.name.toLowerCase(),
		updated_at: Timestamp.now(),
	})

	const newCategory = await getDoc(doc(categoriesRef, id))

	return { id: newCategory.id, ...(newCategory.data() as ICategoryDoc) }
}

export const getCategoryById = async (id: string) => {
	const existedCategory = await getDoc(
		doc(categoriesRef, id)
	)

	if (!existedCategory) {
		return undefined
	}
	const category = existedCategory.data() as ICategoryDoc
	return {
		...category,
		id: existedCategory.id,
	}
}

export const getCategoryByIds = async (ids: string[]) => {
	const categories = await getDocs(
		query(categoriesRef, where(documentId(), 'in', ids))
	)

	return categories.docs.map((d) => ({
		...(d.data() as ICategoryDoc),
		id: d.id,
	}))
}

export const getCategories = async (
	data: IGetDataInput
): Promise<IPaginationRes<ICategoryDb>> => {
	const { keyword, page = 1, size = 5, orderField = "nameLower", orderType = "asc" } = data

	// Base query
	let q = query(categoriesRef, orderBy(orderField, orderType as "asc" | "desc"))

	// Search keyword (nếu có)
	if (keyword) {
		q = query(
			categoriesRef,
			orderBy("nameLower"),
			startAt(keyword.toLowerCase()),
			endAt(keyword.toLowerCase() + "\uf8ff")
		)
	}

	// Nếu page > 1 thì tính toán lastDoc
	if (page > 1) {
		const lastDoc = await getLastVisibleDoc(categoriesRef, page, size, orderField, orderType)
		if (lastDoc) {
			q = query(q, startAfter(lastDoc))
		}
	}

	// Giới hạn số lượng
	q = query(q, limit(size))

	// Lấy dữ liệu
	const categoriesDocsRef = await getDocs(q)
	const categories = categoriesDocsRef.docs.map((d) => ({
		...(d.data() as ICategoryDoc),
		id: d.id,
	}))

	// Lấy tổng
	const total = await getCountFromServer(categoriesRef)

	return {
		meta: {
			total: total.data().count,
			page,
			size,
		},
		data: categories,
	}
}


export const deleteCategoryById = (id: string) => {
	return deleteDoc(doc(categoriesRef, id))
}