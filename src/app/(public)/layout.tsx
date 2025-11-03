import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Boxes, ShoppingCart, User } from "lucide-react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function RootLayout({
	children,

}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<div className="relative container px-48">
			<div className="flex gap-8 py-4 justify-between">
				<div className="flex gap-8">
					<Image src='./next.svg' height={37} width={180} alt="logo" />
					<Input placeholder="Search product ..." className="w-72" />
				</div>
				<div className="flex gap-8">
					<Button>
						<User />
						Account
					</Button>
					<Button>
						<ShoppingCart />
						Cart
					</Button>
				</div>
			</div>
			<div className="grid grid-cols-[200px_1fr]">
				<div>
					<Card>
						<CardHeader>
							<CardTitle>
								<span className="font-semibold text-lg">
								Category list
								</span>
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex gap-2 flex-col">
								<div className="flex gap-1">
									<Boxes />
									Nha cua - doi song
								</div>
								<div className="flex gap-1">
									<Boxes />
									Dien thoai - May tinh bang
								</div>
								<div className="flex gap-1">
									<Boxes />
									Nha cua - doi song
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
				<div className="p-10">{children}</div>
			</div>
		</div>
	)
}