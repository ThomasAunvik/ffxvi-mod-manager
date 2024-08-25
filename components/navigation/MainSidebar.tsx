"use client";
import Link from "next/link";
import {
	Bell,
	ChartLine,
	CircleUser,
	Home,
	LineChart,
	LogIn,
	Menu,
	Package,
	Package2,
	Search,
	Settings,
	ShoppingCart,
	Star,
	UserCog,
	Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { usePathname } from "next/navigation";
import { cn } from "@/components/lib/utils";
import { useContext } from "react";
import { userAtom, UserAtomProvider } from "@/lib/context/UserContext";
import { modAtom } from "@/lib/context/ModContext";
import { useRecoilValue } from "recoil";
import { ModeToggle } from "@/components/theme-toggle";
import { SidebarUpdate } from "@/components/update/SidebarUpdate";

export interface MainSidebarProps {
	children: React.ReactNode;
}

export interface NavItem {
	name: string;
	count?: number;
	icon: React.ReactNode;
	path: string;
}

export const MainSidebar = (props: MainSidebarProps) => {
	const { children } = props;

	const path = usePathname();

	const mod = useRecoilValue(modAtom);

	const navigation: NavItem[][] = [
		[
			{ name: "Home", icon: <Home className="h-4 w-4" />, path: "/" },
			{
				name: "Installed Mods",
				count: mod?.config?.mods?.length,
				icon: <Package className="h-4 w-4" />,
				path: "/installed",
			},
		],
		[
			{
				name: "Settings",
				icon: <Settings className="h-4 w-4" />,
				path: "/settings",
			},
		],
	];

	return (
		<div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
			<div className="hidden border-r bg-muted/40 md:block">
				<div className="flex h-full max-h-screen flex-col gap-2">
					<div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
						<Link href="/" className="flex items-center gap-2 font-semibold">
							<Package2 className="h-6 w-6" />
							<span className="">FFXVI Mod Manager</span>
						</Link>
					</div>
					<div className="flex flex-1 flex-col">
						<nav className="grid items-start px-2 font-medium text-sm lg:px-4">
							{navigation.map((ng, i) => (
								<div key={`sidebar-group-${i}`}>
									{ng.map((n) => (
										<Link
											key={`sidebar-link-${n.name}`}
											className={cn(
												"flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
												n.path == path ? "bg-muted" : "",
											)}
											href={n.path}
										>
											{n.icon}
											<span className="mt-1">{n.name}</span>
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
						<div className="flex-1"></div>
						<div className="mr-2 mb-2 ml-2 flex flex-col">
							<SidebarUpdate />
						</div>
					</div>
				</div>
			</div>
			<div className="flex flex-col">{children}</div>
		</div>
	);
};
