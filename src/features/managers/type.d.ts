import { Timestamp } from "firebase/firestore";

export interface IAdminDb {
    id?: string;
    email: string;
    password: string;
    isActive: boolean;
    deleted_at?: string | Timestamp;
    created_at: string | Timestamp;
    updated_at: string | Timestamp;
}

export type ICreateAdminInput = Pick<IAdminDb,  "email" | "password" | "isActive">;

export interface IAdminDoc
	extends ICreateAdminInput,
	Omit<IDocDb, "id"> {
	nameLower: unknown;
}
declare module "next-auth" {
   
    interface User extends DefaultUser {
        id: string; 
    }

       interface Session extends DefaultSession {
        user: {
            id: string; 
        } & DefaultSession["user"];
    }
}

declare module "next-auth/jwt" {

    interface JWT {
        id: string;
    }
}