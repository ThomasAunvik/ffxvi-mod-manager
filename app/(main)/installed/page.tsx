"use client";
import { MainTopBar } from "@/components/navigation/MainTopbar";
import { ModeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { interopPackListFiles } from "@/lib/interop/pack";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
	FileIcon,
	ImportIcon,
	LoaderCircleIcon,
	RefreshCwIcon,
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { listInstalledMods, Mod } from "@/lib/config/mod";
import { useRecoilState, useRecoilValue } from "recoil";
import { modAtom } from "@/lib/context/ModContext";
import { configAtom } from "@/lib/context/ConfigContext";
import {
	initiateEnabledModsDeploy,
	ModConfig,
	ModDeployConfig,
	ModGlobalConfig,
	writeModConfig,
} from "@/lib/config/deploy";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ModCard } from "@/components/mod/ModCard";
import { ModTable } from "@/components/mod/table/ModTable";
import { DeployDialog } from "@/components/mod/deploy/DeployDialog";
import { convertFileSrc } from "@tauri-apps/api/core";
import { importZipFile, showZipFileDialog } from "@/lib/tools/import";
import { readConfig } from "@/lib/config";

export default function Home() {
	const [result, setResult] = useState("No list found");

	const [config, setConfig] = useRecoilState(configAtom);
	const [mods, setMods] = useRecoilState(modAtom);

	const [listmode, setListmode] = useState(true);

	const [predeploy, setPredeploy] = useState<ModDeployConfig | null>(null);

	const [loadedMods, setLoadedMods] = useState<Mod[] | null>(null);

	const refreshMods = useCallback(async () => {
		let cfg = config;
		if (!cfg) {
			try {
				cfg = await readConfig();
				setConfig(cfg);
			} catch (err) {
				toast(`Failed to load config: ${err}`);
			}
		}

		const folder = cfg?.downloadPath;
		if (!folder) return;

		const newMods = await listInstalledMods(folder);
		if (!newMods) return;

		setLoadedMods(newMods);

		const existing = mods?.config.mods;

		const configMods = newMods.map(
			(mod) =>
				({
					id: mod.id,
					name: mod.name,
					version: mod.version,
					description: mod.description,
					logo: convertFileSrc(`${folder}/${mod.logo}`),
					folder: mod.folder,
					enabled: existing?.find((m) => m.id == mod.id)?.enabled ?? false,
				}) as ModConfig,
		);

		setMods((cfg) => {
			const globalConfig: ModGlobalConfig = {
				mods: configMods,
				deploy: cfg?.config?.deploy ?? {
					mods: cfg?.config?.deploy?.mods ?? [],
				},
			};

			writeModConfig(folder, globalConfig);

			toast("Mod list refreshed", {
				dismissible: true,
			});
			return {
				...cfg,
				config: globalConfig,
			};
		});
	}, [config, mods, setMods]);

	const importMod = useCallback(
		async (filePath?: string) => {
			const folder = config?.downloadPath;
			if (!folder) return;

			const file = filePath ? filePath : await showZipFileDialog();
			if (!file) return;

			await importZipFile(file, folder);

			await refreshMods();
		},
		[refreshMods, config],
	);

	const toggleMod = useCallback(
		async (modId: string, enabled: boolean) => {
			const folder = config?.downloadPath;
			if (!folder) return;

			setMods((cfg) => {
				const mods = [...(cfg?.config.mods ?? [])];

				const modIndex = mods.findIndex((m) => m.id == modId);
				const mod = mods[modIndex];
				if (!mod) return cfg;

				const updatedMod = { ...mod };
				updatedMod.enabled = enabled;

				mods[modIndex] = updatedMod;

				const newConfig: ModGlobalConfig = {
					mods: mods,
					deploy: cfg?.config.deploy,
				};

				writeModConfig(folder, newConfig);

				toast(`${enabled ? "Enabled" : "Disabled"} "${mod.name}"`, {
					dismissible: true,
					duration: 1500,
				});
				return {
					...cfg,
					config: {
						mods: mods,
						deploy: cfg?.config.deploy,
					},
				};
			});
		},
		[config, setMods],
	);

	const initiateDeploy = useCallback(async () => {
		const modlist = mods?.config.mods;
		const cfg = config;
		const downloadPath = cfg?.downloadPath;
		if (!modlist || !cfg || !downloadPath) return;

		const newMods = await listInstalledMods(downloadPath);
		if (!newMods) return;

		setLoadedMods(newMods);

		const files = await initiateEnabledModsDeploy(modlist, cfg);
		if (!files) return;

		setPredeploy({ mods: files });
	}, [mods, config]);

	return (
		<main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
			<div className="flex flex-row items-center gap-4">
				<h1 className="font-semibold text-lg md:text-2xl">Installed Mods</h1>

				<Button onClick={initiateDeploy}>Deploy</Button>
				<div className="flex flex-1 flex-row justify-end gap-2">
					<Button onClick={refreshMods}>
						<RefreshCwIcon className="mr-2 h-4 w-4" />
						<span>Refresh</span>
					</Button>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button>
								<ImportIcon className="mr-2 h-4 w-4" /> <span>Import</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-56">
							<DropdownMenuLabel>Import</DropdownMenuLabel>
							<DropdownMenuItem onClick={() => importMod()}>
								<FileIcon className="mr-2 h-4 w-4" />
								<span>Import from local ZIP file</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
			<div>
				{mods?.config.mods ? (
					<div>
						{mods?.config.mods.length > 0 ? (
							<div>
								{listmode ? (
									<ModTable mods={mods?.config.mods} toggleMod={toggleMod} />
								) : (
									<div className="flex flex-row flex-wrap gap-4 p-4">
										{mods?.config.mods.map((mod) => (
											<ModCard
												key={`mod-card-${mod.id}`}
												mod={mod}
												toggleMod={toggleMod}
											/>
										))}
									</div>
								)}
							</div>
						) : (
							<div>No mods loaded...</div>
						)}
					</div>
				) : (
					<div className="flex flex-col items-center gap-1 text-center">
						<h3 className="font-bold text-2xl tracking-tight">Loading...</h3>
						<div>
							<LoaderCircleIcon className="animate-spin " />
						</div>
					</div>
				)}
				{loadedMods && predeploy ? (
					<DeployDialog
						mods={loadedMods}
						deploy={predeploy}
						dismiss={() => {
							setPredeploy(null);
						}}
					/>
				) : (
					<div></div>
				)}
			</div>
		</main>
	);
}
