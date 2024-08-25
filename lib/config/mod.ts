import { AppConfig } from "@/lib/config";
import { ModConfig } from "@/lib/config/deploy";
import { convertFileSrc } from "@tauri-apps/api/core";
import {
	exists,
	readTextFile,
	writeTextFile,
	readDir,
} from "@tauri-apps/plugin-fs";
import YAML, { YAMLParseError } from "yaml";

export interface Mod {
	id: string;
	name: string;
	description: string;
	version: string;

	logo: string;

	assetgroups: { [group: string]: string[] };

	exclude: string[];
	lib: string[];

	files?: string[];

	folder?: string;
}

export const listInstalledMods = async (folderDir: string) => {
	const modsExist = await exists(folderDir);
	if (!modsExist) {
		throw Error("Mod folder does not exist");
	}

	const modfoldersBroken: string[] = [];
	let parseErrors: { [folder: string]: YAMLParseError } = {};
	const modList: Mod[] = [];

	const modfolders = await readDir(folderDir);
	for (const modfolder of modfolders) {
		if (!modfolder.isDirectory) continue;

		const folder = `${folderDir}/${modfolder.name}`;
		const ymlFilePath = `${folder}/mod.yml`;
		const modexist = await exists(ymlFilePath);
		if (!modexist) {
			modfoldersBroken.push(modfolder.name);
			continue;
		}

		const ymlfile = await readTextFile(ymlFilePath);
		try {
			const data = (await YAML.parse(ymlfile)) as Mod;

			const dupe = modList.find((m) => m.id == data.id);
			if (dupe) {
				throw Error(`Dupe mod found at: ${ymlFilePath}`);
			}

			modList.push({ ...data, folder: modfolder.name });
		} catch (err) {
			if (err instanceof YAMLParseError) {
				console.error(JSON.stringify(err));
				parseErrors = { ...parseErrors, [folder]: err };
			}
			console.error(err);
		}
	}

	return modList;
};
