"use client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { checkForUpdates, downloadUpdates } from "@/lib/tools/updater";
import { Update } from "@tauri-apps/plugin-updater";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export interface SidebarUpdateProps {
	update?: Update;
}

export const SidebarUpdate = (props: SidebarUpdateProps) => {
	const [update, setUpdate] = useState<Update | null>(props.update ?? null);

	const [updating, setIsUpdating] = useState(false);
	const [progress, setProgress] = useState<number>(0.0);

	useEffect(() => {
		if (update) return;

		checkForUpdates().then((hasUpdate) => {
			console.log("Update checked: ", hasUpdate);
			if (!hasUpdate) setUpdate(null);

			setUpdate(hasUpdate);
		});
	}, []);

	const submitUpdate = useCallback(async () => {
		setIsUpdating(true);
		try {
			const newUpdate = await checkForUpdates();
			if (!newUpdate) return;

			await downloadUpdates(newUpdate, (progress) => {
				setProgress(progress);
			});
		} catch (err) {
			toast(`Failed to update... ${err}`);
		} finally {
			setIsUpdating(false);
		}
	}, []);

	if (!update) return <></>;

	return (
		<Button onClick={submitUpdate} disabled={updating} className="h-16">
			{updating ? (
				<div className="flex flex-1 flex-col">
					<span>Updating...</span>
					<Progress value={progress * 100} className=" bg-primary-foreground" />
				</div>
			) : (
				<div className="flex flex-col">
					<span>Update is available</span>
					<span>Download v{update?.version}</span>
				</div>
			)}
		</Button>
	);
};
