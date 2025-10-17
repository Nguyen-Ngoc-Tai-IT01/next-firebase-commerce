import { IDocDb } from "../type"

export interface ICreateCategoryInput {
    name: string,
    slug: string,
    description: string,
    images?: string[]
}

export interface ICategoryDb extends ICreateCategoryInput, IDocDb { }
export interface ICategoryDoc
    extends ICreateCategoryInput,
    Omit<IDocDb, "id"> {
    nameLower: unknown;
}

