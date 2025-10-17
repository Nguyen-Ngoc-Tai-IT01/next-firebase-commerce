"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface IProps {
	path: string,
	icon: ReactNode,
	title: string
}

const NavLink = ({ path, icon, title }: IProps) => {
	const pathName = usePathname()
	return (
		<Link
			href={path}
			className={clsx(
				"flex h-9 w-9 items-center justify-center rounded-lg  transition-colors hover:text-foreground md:h-8 md:w-8  ",
				{ "bg-primary font-semibold text-primary-foreground": pathName.includes(path) }
			)}
		>
			{icon}
			
			<span className="sr-only">{title}</span>
		</Link>
	)
}

export default NavLink