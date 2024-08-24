"use client";
import { MainTopBar } from "@/components/navigation/MainTopbar";
import { ModeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { writeConfig } from "@/lib/config";
import { configAtom } from "@/lib/context/ConfigContext";
import { showGameFolderDialog, showModsFolderDialog } from "@/lib/tauri/dialog";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";

export default function Home() {
	const [config, setConfig] = useRecoilState(configAtom);

	const [gamePath, setGamePath] = useState(config?.gamePath);
	const [downloadPath, setDownloadPath] = useState(config?.downloadPath);

	useEffect(() => {
		setGamePath(config?.gamePath);
		setDownloadPath(config?.downloadPath);
	}, [config]);

	const selectGameFolder = useCallback(async () => {
		const folder = await showGameFolderDialog(config?.gamePath);
		console.log("selected folder", folder);
		if (!folder) return;

		setGamePath(folder);
	}, [config]);

	const selectModsFolder = useCallback(async () => {
		const folder = await showModsFolderDialog(config?.downloadPath);
		console.log("selected folder", folder);
		if (!folder) return;

		setDownloadPath(folder);
	}, [config]);

	const submit = useCallback(async () => {
		setConfig((currVal) => {
			const newConfig = {
				...currVal,
				gamePath: gamePath,
				downloadPath: downloadPath,
			};

			writeConfig(newConfig);
			return newConfig;
		});
	}, [downloadPath, gamePath, setConfig]);

	return (
		<main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
			{config ? (
				<div className="flex flex-col gap-4">
					<div className="flex flex-col gap-2">
						<Label>Game Path:</Label>
						<div className="flex flex-row gap-4">
							<Button onClick={selectGameFolder}>Browse</Button>
							<Input
								placeholder="Enter Game Path"
								value={gamePath}
								onChange={(event) => setGamePath(event.target.value)}
							/>
						</div>
					</div>

					<div className="flex flex-col gap-2">
						<Label>Mods Folder:</Label>
						<div className="flex flex-row gap-4">
							<Button onClick={selectModsFolder}>Browse</Button>
							<Input
								placeholder="Enter Mods Folder Path"
								value={downloadPath}
								onChange={(event) => setDownloadPath(event.target.value)}
							/>
						</div>
					</div>

					<Button onClick={submit}>Save</Button>
				</div>
			) : (
				<div>Loading config....</div>
			)}
		</main>
	);
}
