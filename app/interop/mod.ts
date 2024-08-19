import { ModAtomData } from "@/components/context/ModContext";
import { invoke } from "@tauri-apps/api/core";

export const interopBuildContext = async () => {
	return await invoke<ModAtomData>("build_context");
};
