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
import { AddProductSchema, EditProductSchema } from "./rules"
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
	const { createdId, categoryIds, ...restData } = data
	const created_by = await getManagerById(createdId)
	const categories = await getCategoryByIds(categoryIds)
	const newProductRef = await addDoc(productsRef, {
		...restData,
		created_by: created_by,
		categories: categories,
		categoryIds: categories.map((c) => c.id),
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
	const test = EditProductSchema.safeParse(data)
	if (!test.success) {
		const message = formatZodMessage(test.error)
		throw Error(message)
	}

	// Chỉ cần lấy 1 lần
    const oldProductDoc = await getDoc(doc(productsRef, id))
    if (!oldProductDoc.exists()) {
        throw Error("Product not found!")
    }

	const oldProductData = oldProductDoc.data() as IProductDoc;

    // Logic kiểm tra slug (chỉ chạy NẾU slug được cung cấp và nó khác)
    if (data.slug && data.slug !== oldProductData.slug) {
        const existedProduct = await getProductBySlug(data.slug)
        if (existedProduct) {
            throw Error("Slug have been used!")
        }
    }

	const categories = await getCategoryByIds(data.categoryIds)


	await updateDoc(doc(productsRef, id), {
		...data,
		categories: categories,
		categoryIds: categories.map((c) => c.id),
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

	if (!existedProduct.exists()) {
		return undefined
	}
	const Product = existedProduct.data() as IProductDoc
	return {
		...Product,
		id: existedProduct.id,
	}
}

export const getProducts = async (
    data: IGetDataInput & { categoryIds?: string[] }
): Promise<IPaginationRes<IProductDb>> => {
    const { page = 1, size = 5, orderField = "nameLower", orderType = "asc" } = data;

    // 4. Lọc ra các categoryId rỗng (ví dụ: [''])
    const validCategoryIds = data.categoryIds?.filter(id => id); // Lọc bỏ chuỗi rỗng
    const keyword = data.keyword?.toLowerCase();

    // 3. KIỂM TRA LỖI FIRESTORE CƠ BẢN
    if (keyword && validCategoryIds && validCategoryIds.length > 0) {
        throw new Error("Firestore does not support searching (keyword) and filtering (category) at the same time.");
    }

    let q = query(productsRef); // Bắt đầu với query gốc
    let totalQuery = query(productsRef); // Query để đếm tổng

    if (validCategoryIds && validCategoryIds.length > 0) {
        q = query(q, where('categoryIds', 'array-contains-any', validCategoryIds));
        totalQuery = query(totalQuery, where('categoryIds', 'array-contains-any', validCategoryIds));
    }

    if (keyword) {
        const orderByClause = orderBy("nameLower");
        q = query(q, orderByClause, startAt(keyword), endAt(keyword + "\uf8ff"));
        totalQuery = query(totalQuery, orderByClause, startAt(keyword), endAt(keyword + "\uf8ff"));
    } else {
        // Chỉ orderBy nếu không tìm kiếm bằng keyword
        q = query(q, orderBy(orderField, orderType as "asc" | "desc"));
    }

    //  Đếm dựa trên query đã lọc
    const totalSnapshot = await getCountFromServer(totalQuery);
    const total = totalSnapshot.data().count;

    //  Xây dựng điều kiện phân trang 
    // Chỉ áp dụng cho query lấy data (q)
    if (page > 1) {
        // getLastVisibleDoc CŨNG phải bao gồm các điều kiện 'where'
        const lastDoc = await getLastVisibleDoc(totalQuery, page, size, orderField, orderType);
        if (lastDoc) {
            q = query(q, startAfter(lastDoc));
        }
    }

    q = query(q, limit(size));

    // Lấy dữ liệu
    const productsDocsRef = await getDocs(q);
    const products = productsDocsRef.docs.map((d) => ({
        ...(d.data() as IProductDoc),
        id: d.id,
    }));

    return {
        meta: {
            total: total, // 2. Trả về tổng đã được lọc
            page,
            size,
        },
        data: products,
    };
}

export const deleteProductById = (id: string) => {
	return deleteDoc(doc(productsRef, id))
}

