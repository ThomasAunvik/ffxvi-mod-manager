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
				</SheetContent>
			</Sheet>
			<div className="w-full flex-1">
				<form>
					<div className="relative">
						<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							type="search"
							placeholder="Search mods..."
							className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
						/>
					</div>
				</form>
			</div>
			<TopbarUser />
		</header>
	);
};
