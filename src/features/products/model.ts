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
} from "firebase/firestore"
import { db } from "@/utils/firebase"
import { formatZodMessage } from "@/utils/common/zod"
import { IGetDataInput, IPaginationRes } from "../type"
import { getLastVisibleDoc } from "@/utils/common/queries"
import { ICreateProductInput, IProductDb, IProductDoc } from "./type"
import { AddProductSchema } from "./rules"
import { COLLECTION } from "@/constants/common"
import { getManagerById } from "../managers/model"
import { getCategoryByIds } from "../categories/model"

const productsRef = collection(db, COLLECTION.PRODUCT)

// Lấy category theo slug
export const getProductBySlug = async (slug: string) => {
	const existedProduct = await getDocs(
		query(productsRef, where("slug", "==", slug))
	)

	if (!existedProduct.docs[0]) {
		return undefined
	}
	const Product = existedProduct.docs[0].data() as IProductDoc
	return {
		...Product,
		id: existedProduct.docs[0].id,
	}
}

export const addProduct = async (
	data: ICreateProductInput
): Promise<IProductDb> => {
	const test = AddProductSchema.safeParse(data)
	if (!test.success) {
		const message = formatZodMessage(test.error)
		throw Error(message)
	}

	const existedProduct = await getProductBySlug(data.slug)
	if (existedProduct) {
		throw Error("Slug have been used!")
	}
	const {createdId, categoryIds, 	...restData} = data
	const created_by = await getManagerById(createdId)
	const categories = await getCategoryByIds(categoryIds)
	const newProductRef = await addDoc(productsRef, {
		...restData,
		created_by: created_by,
		categories: categories,
		nameLower: data.name.toLowerCase(),
		deleted_at: "",
		created_at: Timestamp.now(),
		updated_at: Timestamp.now(),
	})

	const newProduct = await getDoc(newProductRef)

	return { id: newProduct.id, ...(newProduct.data() as IProductDoc) }
}

export const editProduct = async (
	id: string,
	data: ICreateProductInput
): Promise<IProductDb> => {
	const test = AddProductSchema.safeParse(data)
	if (!test.success) {
		const message = formatZodMessage(test.error)
		throw Error(message)
	}

	const oldProduct = await getDoc(doc(productsRef, id))
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	if (oldProduct.exists() && data.slug !== (oldProduct.data() as any)?.slug) {
		const existedProduct = await getProductBySlug(data.slug)
		if (existedProduct) {
			throw Error("Slug have been used!")
		}

	}

	await updateDoc(doc(productsRef, id), {
		...data,
		nameLower: data.name.toLowerCase(),
		updated_at: Timestamp.now(),
	})

	const newProduct = await getDoc(doc(productsRef, id))

	return { id: newProduct.id, ...(newProduct.data() as IProductDoc) }
}

export const getProductById = async (id: string) => {
	const existedProduct = await getDoc(
		doc(productsRef, id)
	)

	if (!existedProduct) {
		return undefined
	}
	const Product = existedProduct.data() as IProductDoc
	return {
		...Product,
		id: existedProduct.id,
	}
}

export const getProducts = async (
	data: IGetDataInput
): Promise<IPaginationRes<IProductDb>> => {
	const { keyword, page = 1, size = 5, orderField = "nameLower", orderType = "asc" } = data

	// Base query
	let q = query(productsRef, orderBy(orderField, orderType as "asc" | "desc"))

	// Search keyword (nếu có)
	if (keyword) {
		q = query(
			productsRef,
			orderBy("nameLower"),
			startAt(keyword.toLowerCase()),
			endAt(keyword.toLowerCase() + "\uf8ff")
		)
	}

	// Nếu page > 1 thì tính toán lastDoc
	if (page > 1) {
		const lastDoc = await getLastVisibleDoc(productsRef, page, size, orderField, orderType)
		if (lastDoc) {
			q = query(q, startAfter(lastDoc))
		}
	}

	// Giới hạn số lượng
	q = query(q, limit(size))

	// Lấy dữ liệu
	const productsDocsRef = await getDocs(q)
	const products = productsDocsRef.docs.map((d) => ({
		...(d.data() as IProductDoc),
		id: d.id,
	}))

	// Lấy tổng
	const total = await getCountFromServer(productsRef)

	return {
		meta: {
			total: total.data().count,
			page,
			size,
		},
		data: products,
	}
}


export const deleteProductById = (id: string) => {
	return deleteDoc(doc(productsRef, id))
}

