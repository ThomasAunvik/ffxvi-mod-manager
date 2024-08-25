import { cn } from "@/components/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
	ModDeployConfig,
	ModGlobalConfig,
	writeModConfig,
} from "@/lib/config/deploy";
import { Mod } from "@/lib/config/mod";
import { configAtom } from "@/lib/context/ConfigContext";
import { ArrowRight, FileWarningIcon } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import _ from "lodash";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { modAtom } from "@/lib/context/ModContext";
import { deployFilesToTempFolder } from "@/lib/tools/deploy";
import { toast } from "sonner";

export interface DeployDialogProps {
	mods: Mod[];
	deploy: ModDeployConfig;
	dismiss: () => void;
}

export const DeployDialog = (props: DeployDialogProps) => {
	const { mods, deploy, dismiss } = props;

	const config = useRecoilValue(configAtom);

	const [modConfig, setModConfig] = useRecoilState(modAtom);

	const [submitting, setSubmitting] = useState(false);

	const [selectedDeploys, setSelectedDeploys] = useState(() => {
		const previousDeploy = modConfig?.config.deploy;
		const files = _.cloneDeep(deploy.mods);

		if (!previousDeploy) return files;

		const newfiles = files.map((f) => {
			const findPrevious = previousDeploy.mods.find((p) => p.id == f.id);
			if (!findPrevious) return f;

			f.assets = f.assets.filter((ass) => findPrevious.assets.includes(ass));
			return f;
		});

		return newfiles;
	});

	const anyDuplicates = useMemo(() => {
		return selectedDeploys.some((dep) =>
			dep.assets.some((ass) =>
				selectedDeploys.some(
					(mod) => mod.id != dep.id && mod.assets.includes(ass),
				),
			),
		);
	}, [selectedDeploys]);

	const toggleFiles = useCallback(
		(files: string[], modId: string, toggle: boolean) => {
			setSelectedDeploys((deploy) => {
				const modIndex = deploy.findIndex((d) => d.id == modId);
				let mod = { ...deploy[modIndex] };
				if (!mod) return deploy;

				if (toggle) {
					mod.assets = mod?.assets.filter(
						(asset) => !files.some((f) => asset == f),
					);
				} else {
					const updated = [...new Set([...mod.assets, ...files])];
					mod.assets = updated;
				}

				const newDeploy = [...deploy];
				newDeploy[modIndex] = mod;
				return newDeploy;
			});
		},
		[],
	);

	const submit = useCallback(async () => {
		setSubmitting(true);

		const modsFolder = config?.downloadPath;
		const gameFolder = config?.gamePath;
		if (!modsFolder || !gameFolder) return;

		const globalConfig: ModGlobalConfig = {
			mods: modConfig?.config.mods,
			deploy: { mods: selectedDeploys },
		};

		setModConfig((cfg) => ({ ...cfg, config: globalConfig }));

		await writeModConfig(modsFolder, globalConfig);

		await deployFilesToTempFolder(selectedDeploys, modsFolder, gameFolder);

		dismiss();

		toast("Mods were successfully deployed!");
	}, [setModConfig, selectedDeploys, modConfig, config]);

	const downloadDir = config?.downloadPath;
	if (!downloadDir) return <div></div>;

	return (
		<Dialog open={true} onOpenChange={() => dismiss()}>
			<DialogContent className="max-h-[90%] max-w-[80%] overflow-auto">
				<DialogHeader>
					<DialogTitle>
						<div className="flex flex-row gap-6 align-middle">
							<span className="mt-3">Deployment Verification</span>
							<div>
								<Button onClick={submit} disabled={submitting || anyDuplicates}>
									Deploy
									<ArrowRight className="ml-2 h-4 w-4" />
								</Button>
							</div>
						</div>
					</DialogTitle>
				</DialogHeader>
				<div className="flex flex-col gap-2">
					<div>Deploying to {config?.gamePath}</div>
					{deploy.mods.map((mod) => {
						const otherMods = deploy.mods.filter((m) => m.id != mod.id);
						const selectedDeploy = selectedDeploys.find(
							(dep) => dep.id == mod.id,
						);

						const duplicateFiles = otherMods.map((m) => ({
							modId: m.id,
							modName: m.name,
							assets: m.assets.filter((a) =>
								mod.assets.some((mya) => a == mya),
							),
						}));

						const modinfo = mods.find((m) => m.id == mod.id);

						const groups = modinfo?.assetgroups ?? {};

						let modassets = [...mod.assets];

						let groupedAsset = Object.entries(groups).map(([g, al]) => {
							const assets = modassets.filter((a) =>
								al.some((ma) => a.substring(1, a.length) == ma),
							);
							modassets = modassets.filter(
								(a) => !assets.some((aa) => aa == a),
							);
							return { name: g, assets: assets };
						});

						groupedAsset = [
							...groupedAsset,
							{ name: "Other", assets: modassets },
						].filter((g) => g.assets.length != 0);

						return (
							<div
								key={`mod-list-${mod.id}`}
								className="flex flex-col rounded-md border-2 p-2"
							>
								<div className="mb-2 flex items-center space-x-2">
									<Switch
										id={`enable-mod-${mod.id}`}
										checked={
											selectedDeploy?.id != null &&
											selectedDeploy?.assets.length > 0
										}
										onCheckedChange={(val) =>
											toggleFiles(mod.assets, mod.id, !val)
										}
									/>
									<Label htmlFor={`enable-mod-${mod.id}`}>{mod.name}</Label>
								</div>
								<div>
									{groupedAsset.map((group) => {
										const allSelected = group.assets.every((asset) =>
											selectedDeploy?.assets.includes(asset),
										);

										return (
											<div key={`mod-${mod.id}-group-${group.name}`}>
												{groupedAsset.length >= 1 ? (
													<div className="flex items-center space-x-2 p-1">
														<Switch
															id={`enable-mod-${mod.id}`}
															checked={allSelected}
															onCheckedChange={(val) =>
																toggleFiles(group.assets, mod.id, !val)
															}
														/>
														<Label htmlFor={`enable-mod-${mod.id}`}>
															{group.name}
														</Label>
													</div>
												) : (
													<span></span>
												)}
												<div className="ml-4">
													{group.assets.map((asset) => {
														const duplicateMods = duplicateFiles.filter((m) =>
															m.assets.some(
																(ma) =>
																	ma == asset &&
																	selectedDeploys
																		.find((sm) => sm.id == m.modId)
																		?.assets.includes(ma),
															),
														);

														const selected =
															selectedDeploy?.assets.includes(asset);

														return (
															<div key={`mod-${mod.id}-asset-${asset}`}>
																<div
																	className={cn(
																		"flex items-center space-x-2 p-1",
																		duplicateMods.length > 0 && selected
																			? "text-red-500"
																			: "",
																	)}
																>
																	{duplicateMods.length > 0 && selected ? (
																		<TooltipProvider>
																			<Tooltip>
																				<TooltipTrigger>
																					<FileWarningIcon className="h-4 w-4" />
																				</TooltipTrigger>
																				<TooltipContent>
																					<p>Duplicate Files</p>
																					{duplicateFiles.map((dupe) => (
																						<p
																							key={`mod-${mod.id}-asset-${asset}-duplicate-${dupe.modId}`}
																						>
																							{dupe.modName}
																						</p>
																					))}
																				</TooltipContent>
																			</Tooltip>
																		</TooltipProvider>
																	) : (
																		<span> </span>
																	)}
																	<Switch
																		id={`enable-mod-${mod.id}`}
																		checked={selected}
																		onCheckedChange={(val) =>
																			toggleFiles([asset], mod.id, !val)
																		}
																	/>
																	<Label htmlFor={`enable-mod-${mod.id}`}>
																		{asset.substring(1, asset.length)}
																	</Label>
																</div>
															</div>
														);
													})}
												</div>
											</div>
										);
									})}
								</div>
							</div>
						);
					})}
				</div>
				<DialogFooter>
					<Button onClick={dismiss}>Cancel</Button>
					<Button onClick={submit} disabled={submitting || anyDuplicates}>
						Deploy
						<ArrowRight className="ml-2 h-4 w-4" />
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
