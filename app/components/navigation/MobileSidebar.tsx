"use client";
import { Badge } from "@/components/ui/badge";
import {
	Home,
	LineChart,
	Package,
	Package2,
	ShoppingCart,
	Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const MobileSidebar = () => {
	const path = usePathname();

	return (
		<nav className="grid gap-2 text-lg font-medium">
			<Link href="#" className="flex items-center gap-2 text-lg font-semibold">
				<Package2 className="h-6 w-6" />
				<span className="sr-only">Home</span>
			</Link>
			<Link
				href="#"
				className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
			>
				<Home className="h-5 w-5" />
				Mods Installed
				{/* Updates Available */}
				<Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
					6
				</Badge>
			</Link>
			<Link
				href="#"
				className="mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground"
			>
				<ShoppingCart className="h-5 w-5" />
				Orders
				<Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
					6
				</Badge>
			</Link>
			<Link
				href="#"
				className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
			>
				<Package className="h-5 w-5" />
				Products
			</Link>
			<Link
				href="#"
				className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
			>
				<Users className="h-5 w-5" />
				Customers
			</Link>
			<Link
				href="#"
				className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
			>
				<LineChart className="h-5 w-5" />
				Analytics
			</Link>
		</nav>
	);
};
