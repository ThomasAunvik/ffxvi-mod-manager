import { check, Update } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";

export const checkForUpdates = async () => {
	return await check();
};

export const downloadUpdates = async (
	update: Update,
	onProgress?: (progress: number) => void,
) => {
	let contentLength: number | undefined = 0;
	let downloaded = 0;

	await update.downloadAndInstall((event) => {
		switch (event.event) {
			case "Started":
				contentLength = event.data.contentLength;
				console.log(`started downloading ${event.data.contentLength} bytes`);
				break;
			case "Progress":
				downloaded += event.data.chunkLength;
				console.log(`downloaded ${downloaded} from ${contentLength}`);
				if (onProgress) {
					onProgress(contentLength ? downloaded / contentLength : 0);
				}
				break;
			case "Finished":
				console.log("download finished");
				if (onProgress) {
					onProgress(1);
				}
				break;
		}
	});

	await relaunch();
};
