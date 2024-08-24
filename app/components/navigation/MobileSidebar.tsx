"use client";
import { cn } from "@/components/lib/utils";
import { NavItem } from "@/components/navigation/MainSidebar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { modAtom } from "@/lib/context/ModContext";
import {
	Home,
	LineChart,
	Package,
	Package2,
	Settings,
	ShoppingCart,
	Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRecoilValue } from "recoil";

export const MobileSidebar = () => {
	const path = usePathname();

	const mod = useRecoilValue(modAtom);

	const navigation: NavItem[][] = [
		[
			{ name: "Home", icon: <Home className="h-5 w-5" />, path: "/" },
			{
				name: "Installed Mods",
				count: mod?.config?.mods?.length,
				icon: <Package className="h-5 w-5" />,
				path: "/installed",
			},
		],
		[
			{
				name: "Settings",
				icon: <Settings className="h-5 w-5" />,
				path: "/settings",
			},
		],
	];

	return (
		<nav className="grid gap-2 font-medium text-lg">
			{navigation.map((ng, i) => (
				<div key={`sidebar-group-${i}`}>
					{ng.map((n) => (
						<Link
							key={`sidebar-mobile-link-${n.name}`}
							href={n.path}
							className={cn(
								"mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground",
								n.path == path ? "bg-muted" : "",
							)}
						>
							{n.icon}
							<span>{n.name}</span>
							{n.count && (
								<Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
									{n.count}
								</Badge>
							)}
						</Link>
					))}
					{i < navigation.length - 1 && (
						<Separator key={`sep-${i}`} className="my-2" />
					)}
				</div>
			))}
		</nav>
	);
};
