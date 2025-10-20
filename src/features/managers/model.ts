import {
	addDoc,
	collection,
	getDoc,
	getDocs,
	query,
	Timestamp,
	where,
	CollectionReference,
	FirestoreDataConverter,
	orderBy,
	startAt,
	endAt,
	startAfter,
	limit,
	getCountFromServer,
	doc,
	updateDoc,
	deleteDoc,
} from "firebase/firestore";
import { IAdminDb, IAdminDoc, ICreateAdminInput } from "./type";
import { db } from "@/utils/firebase";
import { COLLECTION } from "@/constants/common";
import { hashPassword } from "@/utils/common/password";
import { IGetDataInput, IPaginationRes } from "../type";
import { getLastVisibleDoc } from "@/utils/common/queries";
import { formatZodMessage } from "@/utils/common/zod";
import { editAdminSchema } from "./rules";

// --- Admin ---
const adminRef: CollectionReference = collection(db, COLLECTION.ADMIN);

// Tìm admin theo email
export const findAdminByEmail = async (
	email: string
): Promise<IAdminDb | null> => {
	const existedAdmin = await getDocs(
		query(adminRef, where("email", "==", email))
	);

	if (existedAdmin.empty) return null;
	const docSnap = existedAdmin.docs[0];
	const admin = existedAdmin.docs[0].data() as IAdminDb;


	return {
		...admin,
		id: docSnap.id,
	};
};

// Tạo admin mới
export const createAdmin = async (data: ICreateAdminInput) => {
	const existedAdmin = await findAdminByEmail(data.email);

	if (existedAdmin) {
		throw new Error("Email is existed!");
	}

	const hashedPassword = await hashPassword(data.password);

	const newAdminRef = await addDoc(adminRef, {
		email: data.email,
		password: hashedPassword,
		isActive: data.isActive ?? true,
		created_at: Timestamp.now(),
		updated_at: Timestamp.now(),
	});

	const newAdmin = await getDoc(newAdminRef);

	return { id: newAdmin.id, ...newAdmin.data() };
};


// edit
export const editManager = async (
	id: string,
	data: Partial<ICreateAdminInput>
): Promise<IAdminDb> => {
	const test = editAdminSchema.partial().safeParse(data);
	if (!test.success) {
		const message = formatZodMessage(test.error);
		throw Error(message);
	}

	const docRef = doc(adminRef, id);
	const oldManager = await getDoc(docRef);
	if (!oldManager.exists()) throw new Error("Admin not found!");

	const updateData: Partial<IAdminDb> = {
		...data,
		updated_at: Timestamp.now(),
	};

	// Chỉ hash password nếu người dùng nhập password mới
	if (data.password && data.password.trim() !== ""){
		updateData.password = await hashPassword(data.password)
	} else{
		delete updateData.password // đảm bảo không ghi đè password cũ
	}

	await updateDoc(docRef, updateData);

	const updatedAdmin = await getDoc(docRef);
	return { id: updatedAdmin.id, ...(updatedAdmin.data() as IAdminDb) };
};

export const getManagerById = async (id: string) => {
	const existedManager = await getDoc(
		doc(adminRef, id)
	)

	if (!existedManager.exists()) {
		return undefined
	}
	const manager = existedManager.data() as IAdminDb
	return {
		...manager,
		id: existedManager.id,
		created_at: manager.created_at instanceof Timestamp
			? manager.created_at.toDate().toISOString()
			: manager.created_at,
		updated_at: manager.updated_at instanceof Timestamp
			? manager.updated_at.toDate().toISOString()
			: manager.updated_at,
	}
}

const managerConverter: FirestoreDataConverter<IAdminDb> = {
	toFirestore: (data) => data,
	fromFirestore: (snap) => snap.data() as IAdminDb,
};

// Collection reference có converter
const managersRef: CollectionReference<IAdminDb> =
	collection(db, COLLECTION.ADMIN).withConverter(managerConverter);



export const getManagers = async (
	data: IGetDataInput
): Promise<IPaginationRes<IAdminDb>> => {
	const { keyword, page = 1, size = 5, orderField = "Email", orderType = "asc" } = data

	let q = query(managersRef); // Query lấy data
    let totalQuery = query(managersRef); // Query để đếm tổng
	// Search keyword (nếu có)
	if (keyword) {
		const normalizedKeyword = keyword.toLowerCase(); // Chuẩn hóa keyword
        const orderByClause = orderBy("email"); // Tìm kiếm dựa trên email
        
        // Áp dụng cho query lấy data
        q = query(q, orderByClause, startAt(normalizedKeyword), endAt(normalizedKeyword + "\uf8ff"));
        // Áp dụng cho query đếm tổng
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        totalQuery = query(totalQuery, orderByClause, startAt(normalizedKeyword), endAt(normalizedKeyword + "\uf8ff"));
	}else{
		q = query(q, orderBy(orderField, orderType as "asc" | "desc"));
	}

	const totalSnapshot = await getCountFromServer(totalQuery);
    const total = totalSnapshot.data().count;

	// Nếu page > 1 thì tính toán lastDoc
	if (page > 1) {
		const lastDoc = await getLastVisibleDoc(totalQuery, page, size, orderField, orderType); 
        if (lastDoc) {
            q = query(q, startAfter(lastDoc));
        }
	}

	// Giới hạn số lượng
	q = query(q, limit(size))

	// Lấy dữ liệu
	const managersDocsRef = await getDocs(q)
	const managers = managersDocsRef.docs.map((d) => ({
		...(d.data() as IAdminDb),
		id: d.id,
	}))

	return {
		meta: {
			total: total,
			page,
			size,
		},
		data: managers,
	}
}

export const deleteManagerById = (id: string) => {
	return deleteDoc(doc(managersRef, id))
}

export const updateActiveAdmin = async (id: string, isActive: boolean) => {

	await updateDoc(doc(adminRef, id), {
		isActive
	})

	const newManager = await getDoc(doc(adminRef, id))

	return { id: newManager.id, ...(newManager.data() as IAdminDoc) }
}
