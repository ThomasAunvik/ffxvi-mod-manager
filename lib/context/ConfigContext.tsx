"use client";
import { AppConfig, readConfig, writeConfig } from "@/lib/config";
import { useCallback, useEffect, useRef } from "react";
import { atom, useSetRecoilState } from "recoil";
import { toast } from "sonner";

export const configAtom = atom<AppConfig | null>({
	key: "config", // unique ID (with respect to other atoms/selectors)
	default: null, // default value (aka initial value)
});

export interface ConfigAtomProviderProps {
	children: React.ReactNode;
}

export const ConfigAtomProvider = (props: ConfigAtomProviderProps) => {
	const setConfig = useSetRecoilState(configAtom);

	const mounted = useRef(false);

	const updateConfig = useCallback(async () => {
		try {
			const res = await readConfig();
			setConfig(res);
		} catch (err) {
			toast(`Failed to load config: ${err}`);
		}
	}, [setConfig]);

	useEffect(() => {
		if (mounted.current) return;
		mounted.current = true;

		updateConfig();
	}, [updateConfig]);

	return props.children;
};
