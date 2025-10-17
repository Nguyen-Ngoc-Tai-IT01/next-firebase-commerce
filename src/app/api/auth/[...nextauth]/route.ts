import { findAdminByEmail } from "@/features/managers/model";
import { loginSchema } from "@/features/managers/rules";
import { ICreateAdminInput } from "@/features/managers/type";
import { comparePassword } from "@/utils/common/password";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";


// dùng để xây dựng trang đăng nhập và kiểm tra email và password 

export const adminLogin = async (email: string, password: string) => {
	const existedAdmin = await findAdminByEmail(email)
	// kiem tra emai
	if (!existedAdmin) {
		throw new Error('This email is not exist!')
	}

	const isMathPassword = await comparePassword(password, existedAdmin.password)
	// kiem tra password
	if (!isMathPassword) {
		throw new Error('The password is wrong!')
	}

	const isActive = existedAdmin.isActive ?? false;
	if (!isActive ) {
		throw new Error('This admin is inactive! ')
	}
	return {
		email: existedAdmin.email,
		id: existedAdmin.id,
	}
}
export const authOptions: NextAuthOptions = {
	session: {
		strategy: "jwt"
	},
	providers: [
		CredentialsProvider({
			credentials: {
				email: { label: "Email", type: "text" },
				password: { label: "Password", type: "password" }
			},
			async authorize(credentials, req) {
				const { email, password } = credentials as ICreateAdminInput
				const data = loginSchema.safeParse({ email, password })

				if (!data.success) {
					const messages = JSON.parse(data.error.message);
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					throw Error(messages.map((i: any) => i.message).join(","))
				}
				return adminLogin(email, password)
			}
		})
	],
	callbacks: {},
}

const authHandler = NextAuth(authOptions)

export { authHandler as GET, authHandler as POST }