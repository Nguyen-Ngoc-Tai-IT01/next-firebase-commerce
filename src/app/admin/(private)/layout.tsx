import { Toaster } from "sonner";;
import Link from "next/link";
import {
	ArrowRightToLine,
	Boxes,
	Package,
	PanelLeft,
	Settings,
	User,
	Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
	Sheet,
	SheetContent,
	SheetTrigger,
} from "@/components/ui/sheet"

import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip"
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Logout from "@/components/common/logout";
import NavLink from "@/components/common/navlink";

export const ADMIN_PAGES = [
	{ path: '/admin/categories', name: 'Categories', icon: <Boxes className="h-5 w-5" /> },
	{ path: '/admin/products', name: 'Products', icon: <Package className="h-5 w-5" /> },
	{ path: '/admin/managers', name: 'Managers', icon: <Users className="h-5 w-5" /> }
]

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {

	const session = await getServerSession(authOptions)

	if (!session?.user) {
		redirect("/admin/auth")
	}
	return (
		<div className="flex min-h-screen w-full flex-col bg-muted/40">
			<aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
				<nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
					{ADMIN_PAGES.map((page) => (
						<TooltipProvider key={page.path}>
							<Tooltip>
								<TooltipTrigger asChild>
									<NavLink path = {page.path} icon={page.icon} title = {page.name}/>
								</TooltipTrigger>
								<TooltipContent side="right">{page.name}</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					))}
				</nav>
				<nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Link
									href="#"
									className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
								>
									<Settings className="h-5 w-5" />
									<span className="sr-only">Settings</span>
								</Link>
							</TooltipTrigger>
							<TooltipContent side="right">Settings</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</nav>
			</aside>
			<div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
				<header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
					<Sheet>
						<SheetTrigger asChild>
							<Button size="icon" variant="outline" className="sm:hidden">
								<PanelLeft className="h-5 w-5" />
								<span className="sr-only">Toggle Menu</span>
							</Button>
						</SheetTrigger>
						<SheetContent side="left" className="sm:max-w-xs">
							<nav className="grid gap-6 text-lg font-medium">
								{ADMIN_PAGES.map((page) => (
									<Link
										key={page.path}
										href={page.path}
										className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
									>
										{page.icon}
										{page.name}
									</Link>
								))}
							</nav>
						</SheetContent>
					</Sheet>
					<h2 className="text-lg font-bold">Admin panel</h2>
					<div className="relative ml-auto ">
						<DropdownMenu >
							<DropdownMenuTrigger asChild>
								<Button
									variant="outline"
									size="icon"
									className="overflow-hidden rounded-full"
								>
									<User className="w-9 h-9" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuLabel>{session?.user?.email ?? "No email"}</DropdownMenuLabel> 
								<DropdownMenuSeparator />
								<DropdownMenuItem>Settings</DropdownMenuItem>
								<DropdownMenuItem>Support</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem>
									<ArrowRightToLine className="" />
									<Logout />
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

				</header>
				<main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
					{children}
					<Toaster />
				</main>
			</div>
		</div>
	)
}





