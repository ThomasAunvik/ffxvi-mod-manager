"use client";
import { interopBuildContext } from "@/interop/mod";
import { useCallback, useEffect } from "react";
import { atom, useRecoilState } from "recoil";

export interface ModAtomData {
	installed: string[];
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

	const updateContext = useCallback(async () => {
		const res = await interopBuildContext();
		setContext(res);
		console.log(res);
	}, []);

	useEffect(() => {
		updateContext();
	}, [updateContext]);

	return props.children;
};
