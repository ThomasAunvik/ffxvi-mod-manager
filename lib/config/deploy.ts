import { AppConfig } from "@/lib/config";
import { Mod } from "@/lib/config/mod";
import { interopUnlockFolders } from "@/lib/interop/mod";
import {
	DirEntry,
	exists,
	readDir,
	readTextFile,
	writeTextFile,
} from "@tauri-apps/plugin-fs";
import YAML, { YAMLParseError } from "yaml";

export interface ModGlobalConfig {
	mods?: ModConfig[];
	deploy?: ModDeployConfig;
}

export interface ModConfig {
	id: string;
	name: string;
	version: string;
	description: string;
	logo: string;

	folder: string;
	enabled: boolean;
}

export interface ModDeployConfig {
	mods: ModDeploy[];
}

export interface ModDeploy {
	id: string;
	name: string;
	version: string;
	folder: string;

	assets: string[];
}

export const writeModConfig = async (
	baseDir: string,
	config: ModGlobalConfig,
) => {
	const data = JSON.stringify(config);

	await writeTextFile(`${baseDir}/mods.json`, data, {
		create: true,
	});
};

export const readModConfig = async (baseDir: string) => {
	await interopUnlockFolders();

	const fileExists = await exists(`${baseDir}/mods.json`);

	if (!fileExists) {
		await writeModConfig(baseDir, { mods: [], deploy: { mods: [] } });
	}

	const res = await readTextFile(`${baseDir}/mods.json`);

	const data = JSON.parse(res);
	return data as ModGlobalConfig;
};

export const initiateEnabledModsDeploy = async (
	mods: ModConfig[],
	app: AppConfig,
) => {
	const modPath = app.downloadPath;
	if (!modPath) return;

	const enabledMods = mods.filter((m) => m.enabled);

	const modfiles: ModDeploy[] = [];

	for (const mod of enabledMods) {
		const folderPath = `${modPath}/${mod.folder}`;
		const ymlPath = `${folderPath}/mod.yml`;

		const ymlfile = await readTextFile(ymlPath);

		const data = (await YAML.parse(ymlfile)) as Mod;

		const files: string[] = [];

		const readFolder = async (fPath: string, entry: DirEntry[]) => {
			for (const dirEntry of entry) {
				const dirName = `${fPath}/${dirEntry.name}`;

				if (dirEntry.name == "mod.yml") {
					continue;
				}

				if (
					data.exclude.some((e) =>
						e.endsWith("*")
							? dirName.startsWith(
									`${folderPath}/${e.substring(0, e.length - 1)}`,
								)
							: `${folderPath}/${e}` == dirName,
					)
				) {
					continue;
				}

				if (dirEntry.isSymlink) continue;
				if (dirEntry.isFile) {
					files.push(dirName);
					continue;
				}

				const fold = await readDir(dirName);

				await readFolder(dirName, fold);
			}
		};

		const root = await readDir(folderPath);

		await readFolder(folderPath, root);

		const newfilenames = files.map((asset) =>
			asset.substring(folderPath.length, asset.length),
		);

		modfiles.push({
			id: data.id,
			name: data.name,
			version: data.version,
			folder: mod.folder,
			assets: newfilenames,
		});
	}

	return modfiles;
};
