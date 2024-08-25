"use client";

import { ConfigAtomProvider } from "@/lib/context/ConfigContext";
import { RecoilRoot } from "recoil";

export const RecoilProvider = ({ children }: { children: React.ReactNode }) => {
	return (
		<RecoilRoot>
			<ConfigAtomProvider>{children}</ConfigAtomProvider>
		</RecoilRoot>
	);
};
