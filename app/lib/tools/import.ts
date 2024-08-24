import { writeModConfig } from "@/lib/config/deploy";
import { Mod } from "@/lib/config/mod";
import { interopUnpackZip } from "@/lib/interop/mod";
import { ask, open } from "@tauri-apps/plugin-dialog";
import {
	exists,
	writeTextFile,
	mkdir,
	readTextFile,
	rename,
} from "@tauri-apps/plugin-fs";
import YAML, { YAMLParseError } from "yaml";

const generateRandom = () =>
	Math.random().toString(36).substring(2, 15) +
	Math.random().toString(23).substring(2, 5);

export const showZipFileDialog = async () => {
	const file = await open({
		multiple: false,
		directory: false,
		filters: [{ name: "Mod Package", extensions: ["zip"] }],
		title: "Select the mod file to import",
	});

	if (!file) return;

	return file.path;
};

export const importZipFile = async (filePath: string, modsFolder: string) => {
	const fileExists = await exists(filePath);
	if (!fileExists) return;

	const rando = generateRandom();

	const folderToUnzip = `${modsFolder}/${rando}`;
	await mkdir(folderToUnzip);

	await interopUnpackZip(filePath, folderToUnzip);

	const ymlFilePath = `${folderToUnzip}/mod.yml`;
	const modexist = await exists(ymlFilePath);
	if (!modexist) {
		return;
	}

	const ymlfile = await readTextFile(ymlFilePath);
	try {
		const data = (await YAML.parse(ymlfile)) as Mod;

		const newFolderName = `${modsFolder}/${data.name.replaceAll(" ", "")}-${rando}`;
		await rename(folderToUnzip, newFolderName);
	} catch (err) {
		if (err instanceof YAMLParseError) {
			console.error(JSON.stringify(err));
		}
		console.error(err);
	}
};
