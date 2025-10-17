// Dữ liệu thô trong Firestore
export interface IDocDb {
	id: string
	deleted_at:{
		seconds: number
		nanoseconds: number
	}
	created_at: {
		toDate(): unknown
		seconds: number
		nanoseconds: number
	}
	updated_at: {
		seconds: number
		nanoseconds: number
	}
}

// Dữ liệu sau khi convert ra cho client (ISO string)
export interface IDocDbClient {
	id: string
	deleted_at: string
	created_at: string
	updated_at: string
}

export interface IPaginationRes<T> {
	meta: {
		total: number
		page: number
		size: number
	}
	data: Array<T>
}

export interface IGetDataInput {
    keyword?: string
	page?: number
	orderField: string
	orderType: 'asc' | 'desc'
	size?: number
}

