"use client";
import { ModGlobalConfig, readModConfig } from "@/lib/config/deploy";
import { configAtom } from "@/lib/context/ConfigContext";
import { interopBuildContext } from "@/lib/interop/mod";
import { useCallback, useEffect } from "react";
import { atom, useRecoilState, useRecoilValue } from "recoil";

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
		if (!basePath) return;

		const res = await readModConfig(basePath);
		setContext({ config: res });
		console.log(res);
	}, [basePath, setContext]);

	useEffect(() => {
		updateContext();
	}, [updateContext]);

	return props.children;
};
