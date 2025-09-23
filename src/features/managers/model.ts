import { addDoc, collection, getDoc, getDocs, query, Timestamp, where } from "firebase/firestore";
import { IAdminDb, ICreateAdminInput } from "./type";
import { db } from "@/utils/firebase";
import { COLLECTION } from "@/constants/common";
import { hashPassword } from "@/utils/common/password";

const adminRef = collection(db, COLLECTION.ADMIN)

export const findAdminByEmail = async (email: string ): Promise<IAdminDb> => {
    const existedAdmin = await getDocs(
        query(adminRef, where('email', '==', email))
    )

    const admin = existedAdmin.docs[0].data() as IAdminDb;

    return {
        ...admin,
        email: existedAdmin.docs[0].id
    }
}

export const createAdmin = async (data: ICreateAdminInput) => {
    //TODO: save to firebase

    const adminRef = collection(db, COLLECTION.ADMIN)

    // kiểm tra email truyền lên đã tồn tại chưa
    const existedAdmin = await findAdminByEmail(data.email)

    if (existedAdmin) {
        throw Error('Email is existed!')
    }

    const hardedPassword = await hashPassword(data.password)

    const newAdminRef = await addDoc(adminRef, {
        email: data.email,
        password: hardedPassword,
        created_at: Timestamp.now(),
        updated_at: Timestamp.now()
    })

    const newAdmin = await getDoc(newAdminRef)

    return { id: newAdmin.id, ...newAdmin.data() }
}