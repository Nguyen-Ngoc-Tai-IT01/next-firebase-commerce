import { ICategoryDb } from "../categories/type"
import { IAdminDb } from "../managers/type"
import { IDocDb } from "../type"

export interface ICreateProductInput {
	name: string,
	slug: string,
	description: string,
	createdId: string,
	images?: string[]
	categoryIds: string[]
	properties: Array<{
		name: string
		color?: string
		size?: string
		price: number
	}>	
	defaultPrice?: number
}

export interface IProductDb extends Omit<ICreateProductInput, 'createdId' | 'categoryIds'>, IDocDb {
	created_by: IAdminDb,
	categories: ICategoryDb[]
}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IProductDoc extends Omit<IProductDb, "id"> {}

