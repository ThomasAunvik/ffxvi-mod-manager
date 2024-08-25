import { ModDeploy } from "@/lib/config/deploy";
import { interopPackFiles } from "@/lib/interop/pack";
import {
	copyFile,
	exists,
	mkdir,
	remove,
	readDir,
} from "@tauri-apps/plugin-fs";

const pacFolders = [
	"0000",
	"0001",
	"0001.en",
	"0001.de",
	"0001.fr",
	"0001.it",
	"0001.ja",
	"0001.ko",
	"0001.ls",
	"0001.pb",
	"0001.pl",
	"0001.ru",
	"0002",
	"0002.en",
	"0002.de",
	"0002.fr",
	"0002.it",
	"0002.ja",
	"0002.ls",
	"0003",
	"0003.h",
];

const protectedFiles = ["ffxvi.exe"];

export const deployFilesToTempFolder = async (
	deploys: ModDeploy[],
	modsFolder: string,
	gameFolder: string,
) => {
	const deployFolder = `${modsFolder}/deploy`;
	const deployExists = await exists(deployFolder);
	if (deployExists) {
		// Remove deploy folder if exists
		await remove(deployFolder, { recursive: true });
	}

	// Recreate folder
	await mkdir(`${modsFolder}/deploy`);

	for (const deploy of deploys) {
		const modfolder = `${modsFolder}/${deploy.folder}`;
		for (const file of deploy.assets) {
			const filepath = `${modfolder}${file}`;
			const target = `${deployFolder}${file}`;

			const dirname = target.match(/(.*)[\/\\]/)![1] || "";

			const folderExist = await exists(dirname);
			if (!folderExist) {
				await mkdir(dirname, { recursive: true });
			}

			await copyFile(filepath, target);
			console.log("Copying file: ", file);
		}
	}

	await generatePacFiles(modsFolder);

	await deployFilesToGame(deploys, modsFolder, gameFolder);
};

export const generatePacFiles = async (modsFolder: string) => {
	const deployFolder = `${modsFolder}/deploy`;
	const deployExists = await exists(deployFolder);
	if (!deployExists) {
		throw Error("Unable to generate pac files, deploy folder does not exist");
	}

	for (const pacFolder of pacFolders) {
		const deployPac = `${deployFolder}/data/${pacFolder}`;
		const pacFolderExist = await exists(deployPac);
		if (!pacFolderExist) continue;

		const res = await interopPackFiles(deployPac);
		console.log(res);
	}
};

export const deployFilesToGame = async (
	deploys: ModDeploy[],
	modsFolder: string,
	gameFolder: string,
) => {
	const deployFolder = `${modsFolder}/deploy`;
	const deployExists = await exists(deployFolder);

	if (!deployExists) {
		throw Error("Unable to deploy files, deploy folder does not exist");
	}

	for (const pacFolder of pacFolders) {
		const deployPac = `${deployFolder}/data/${pacFolder}.diff.pac`;
		const gamePac = `${gameFolder}/data/${pacFolder}.diff.pac`;
		const pacFileExist = await exists(deployPac);
		if (!pacFileExist) {
			const gamePacExists = await exists(gamePac);
			if (!gamePacExists) continue;

			await remove(gamePac);
			continue;
		}

		await copyFile(deployPac, gamePac);
	}

	/*
	const deployItems = await readDir(deployFolder);
	for (const item of deployItems) {
		if (item.name == "data") continue;

		const itemPath = `${deployFolder}/${item.name}`;
		const targetPath = `${gameFolder}/${item.name}`;

		await copyFile(itemPath, targetPath);
	}*/
};
