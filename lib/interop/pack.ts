import { ModAtomData } from "@/lib/context/ModContext";
import { invoke } from "@tauri-apps/api/core";

export const interopPackListFiles = async (pacName: string) => {
	return await invoke<string>("pack_list_files", { pacName: pacName });
};

export const interopPackFiles = async (folder: string) => {
	return await invoke<string>("pack_files", { folder: folder });
};
