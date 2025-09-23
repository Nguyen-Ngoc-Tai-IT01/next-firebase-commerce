"use client"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ICreateAdminInput } from "@/features/managers/type"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export default function AdminLoginForm() {
    const router = useRouter()

    const form = useForm<ICreateAdminInput>({
        mode: "onBlur",
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const {
        control,
        handleSubmit,
        formState: { isValid },
    } = form

    const onLogin = async (data: ICreateAdminInput) => {
        try {
            const res = await signIn("credentials", {
                email: data.email,
                password: data.password,
                redirect: false,
            })
            if (res?.error) {
                console.log("🚀 ~ onLogin ~ res?.error:", res?.error)
                toast.error("Can't login, check your email or password")
            } else {
                router.push("/admin/categories")
            }
        } catch (error) {
            console.log("🚀 ~ onLogin ~ error:", error)
            toast.error("Login failed, please try again")
        }
    }

    return (
        <div className="flex flex-1 justify-center items-center h-screen">
            <Form {...form}>
                <form onSubmit={handleSubmit(onLogin)} className="w-full max-w-sm">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">Admin Login</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-6">
                            <FormField
                                control={control}
                                name="email"
                                rules={{
                                    required: { value: true, message: "Email is required" },
                                    pattern: {
                                        value: /^\S+@\S+\.\S+$/,
                                        message: "Email is invalid",
                                    },// khi ko nhập cả hai trường password và email thì không thể login đc (disabled={!isValid} dưới button) 
                                }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="m@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name="password"
                                rules={{
                                    required: {
                                        value: true,
                                        message: "Password is required"
                                    },
                                    minLength: {
                                        value: 3,
                                        message: "Password is short"
                                    }
                                }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="***" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full" disabled={!isValid}>
                                Login
                            </Button>
                        </CardContent>
                    </Card>
                </form>
            </Form>
        </div>
    )
}
