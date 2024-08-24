import { appConfigDir } from "@tauri-apps/api/path";
import {
	writeTextFile,
	readTextFile,
	writeFile,
	exists,
	BaseDirectory,
	mkdir,
} from "@tauri-apps/plugin-fs";

export interface AppConfig {
	gamePath?: string;
	downloadPath?: string;
}

export const writeConfig = async (config: AppConfig) => {
	const data = JSON.stringify(config);

	console.log("Writing...", data);

	await mkdir("config", {
		baseDir: BaseDirectory.AppConfig,
		recursive: true,
	});

	await writeTextFile("config/config.json", data, {
		baseDir: BaseDirectory.AppConfig,
		create: true,
	});
};

export const readConfig = async () => {
	const folder = await appConfigDir();
	console.log("Reading log file from: ", folder);

	const fileExists = await exists("config/config.json", {
		baseDir: BaseDirectory.AppConfig,
	});

	if (!fileExists) {
		await writeConfig({});
	}

	const res = await readTextFile("config/config.json", {
		baseDir: BaseDirectory.AppConfig,
	});

	const data = JSON.parse(res);
	return data as AppConfig;
};
