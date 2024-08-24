import { writeModConfig } from "@/lib/config/deploy";
import { ask, open } from "@tauri-apps/plugin-dialog";
import { exists, writeTextFile } from "@tauri-apps/plugin-fs";

export const showGameFolderDialog = async (previousPath?: string) => {
	const folder = await open({
		multiple: false,
		directory: true,
		defaultPath: previousPath,
		recursive: true,
		title: "Select foldder where ffxvi.exe is",
	});

	if (!folder) return;

	const exeExist = await exists(`${folder}/ffxvi_demo.exe`);
	if (!exeExist) {
		const answer = await ask(
			"This folder does not contain game executable (ffxvi.exe/ffxvi_demo.exe), continue?",
			{
				title: "Game executable not found",
				kind: "warning",
			},
		);

		if (!answer) return;
	}

	return folder;
};

export const showModsFolderDialog = async (previousPath?: string) => {
	const folder = await open({
		multiple: false,
		directory: true,
		defaultPath: previousPath,
		title: "Select folder for your mods to be stored at",
	});

	if (!folder) return;

	const configExist = await exists(`${folder}/mods.json`);
	if (!configExist) {
		const answer = await ask(
			"This folder does not contain existing mod folder config, continue? This will generate a new mod config.",
			{
				title: "Mod config creation",
				kind: "warning",
			},
		);

		if (!answer) return;

		await writeModConfig(folder, { mods: [], deploy: { mods: [] } });
	}

	return folder;
};
