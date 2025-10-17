import { DocumentData, getDocs, limit, orderBy, query, Query } from "firebase/firestore"

// Lấy document cuối để làm startAfter
export const getLastVisibleDoc = async (
	queryRef: Query<DocumentData>,
	page: number,
	size: number,
	orderField: string,
	orderType: "asc" | "desc"
) => {
	const docFromStart = await getDocs(
		query(queryRef, orderBy(orderField, orderType), limit((page - 1) * size))
	)
	return docFromStart.docs[docFromStart.docs.length - 1]
}
