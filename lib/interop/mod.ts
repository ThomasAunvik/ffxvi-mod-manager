import { ModAtomData } from "@/lib/context/ModContext";
import { invoke } from "@tauri-apps/api/core";

export const interopBuildContext = async () => {
	return await invoke<ModAtomData>("build_context");
};

export const interopUnlockFolders = async () => {
	return await invoke<string>("unlock_folders");
};

export const interopUnpackZip = async (file: string, folder: string) => {
	return await invoke<string>("unpack_zip", { file, folder });
};
