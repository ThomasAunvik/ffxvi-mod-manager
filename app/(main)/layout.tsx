import { MainSidebar } from "@/components/navigation/MainSidebar";
import { MainTopBar } from "@/components/navigation/MainTopbar";
import { Toaster } from "@/components/ui/sonner";

interface LayoutProps {
	children: React.ReactNode;
}

const Layout = (props: Readonly<LayoutProps>) => {
	return (
		<MainSidebar>
			<MainTopBar />
			{props.children}
		</MainSidebar>
	);
};

export default Layout;
