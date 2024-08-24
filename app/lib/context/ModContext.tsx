"use client";
import { ModGlobalConfig, readModConfig } from "@/lib/config/deploy";
import { configAtom } from "@/lib/context/ConfigContext";
import { interopBuildContext } from "@/lib/interop/mod";
import { useCallback, useEffect } from "react";
import { atom, useRecoilState, useRecoilValue } from "recoil";
import { toast } from "sonner";

export interface ModAtomData {
	config: ModGlobalConfig;
}

export const modAtom = atom<ModAtomData | null>({
	key: "mod", // unique ID (with respect to other atoms/selectors)
	default: null, // default value (aka initial value)
});

export interface ModAtomProviderProps {
	children: React.ReactNode;
}

export const ModAtomProvider = (props: ModAtomProviderProps) => {
	const [context, setContext] = useRecoilState(modAtom);
	const appConfig = useRecoilValue(configAtom);
	const basePath = appConfig?.downloadPath;

	const updateContext = useCallback(async () => {
		try {
			if (!basePath) return;

			const res = await readModConfig(basePath);
			setContext({ config: res });
		} catch (err) {
			toast(`Failed to load config: ${err}`);
		}
	}, [basePath, setContext]);

	useEffect(() => {
		updateContext();
	}, [updateContext]);

	return props.children;
};
