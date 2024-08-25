import { ModDeploy } from "@/lib/config/deploy";
import { interopPackFiles } from "@/lib/interop/pack";
import { copyFile, exists, mkdir, remove } from "@tauri-apps/plugin-fs";

const pacFolders = ["0000", "0001", "0002", "0003"];

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

		await interopPackFiles(deployPac);
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
			if (!gamePacExists) return;

			await remove(gamePac);
			return;
		}

		await copyFile(deployPac, gamePac);
	}
};
