import bcrypt from "bcrypt";

// bảo mật mật khẩu
// vi du mk:123 -> 34nqwdajsdnjkasndlka
export const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds)

    return bcrypt.hash(password, salt)
}

// so sanh password bằng thuật toán
export const comparePassword = (password: string, hashedPassword: string): Promise<boolean> =>{
    return bcrypt.compare(password, hashedPassword)
}