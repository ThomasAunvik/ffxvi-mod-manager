import { ModAtomData } from "@/components/context/ModContext";
import { invoke } from "@tauri-apps/api/core";

export const interopPackListFiles = async (pacName: string) => {
	return await invoke<string>("pack_list_files", { pacName: pacName });
};
