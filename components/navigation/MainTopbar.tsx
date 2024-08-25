import {
	CircleUser,
	Home,
	LineChart,
	Menu,
	Package,
	Package2,
	Search,
	ShoppingCart,
	Users,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { Input } from "@/components/ui/input";
import { MobileSidebar } from "@/components/navigation/MobileSidebar";
import { TopbarUser } from "@/components/navigation/TopbarUser";
import { SidebarUpdate } from "@/components/update/SidebarUpdate";

export const MainTopBar = () => {
	return (
		<header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
			<Sheet>
				<SheetTrigger asChild>
					<Button variant="outline" size="icon" className="shrink-0 md:hidden">
						<Menu className="h-5 w-5" />
						<span className="sr-only">Toggle navigation menu</span>
					</Button>
				</SheetTrigger>
				<SheetContent side="left" className="flex flex-col">
					<MobileSidebar />

					<div className="flex-1"></div>
					<div className="mr-2 mb-2 ml-2 flex flex-col">
						<SidebarUpdate />
					</div>
				</SheetContent>
			</Sheet>
		</header>
	);
};
