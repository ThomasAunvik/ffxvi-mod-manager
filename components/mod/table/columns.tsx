"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ModConfig } from "@/lib/config/deploy";
import { ColumnDef } from "@tanstack/react-table";
export interface ModColumnProps {
	toggleMod: (modId: string, enabled: boolean) => void;
}

export const generateModColumns = (
	props: ModColumnProps,
): ColumnDef<ModConfig>[] => {
	const { toggleMod } = props;

	return [
		{
			accessorKey: "id",
			header: "Id",
		},
		{
			accessorKey: "enabled",
			header: "Enabled",
			cell: (data) => {
				const enabled = data.row.getValue("enabled") as boolean | undefined;
				const id = data.row.getValue("id") as string;
				return (
					<div className="flex items-center space-x-2">
						<Switch
							id={`enable-mod-${id}`}
							defaultChecked={enabled ?? false}
							onCheckedChange={(val) => toggleMod(id, val)}
						/>
					</div>
				);
			},
		},
		{
			accessorKey: "name",
			header: "Name",
		},
		{
			accessorKey: "description",
			header: "Description",
		},
		{
			accessorKey: "version",
			header: "Version",
		},
	] as ColumnDef<ModConfig>[];
};
export const columns: ColumnDef<ModConfig>[] = [
	{
		accessorKey: "enabled",
		header: "Enabled",
	},
	{
		accessorKey: "name",
		header: "Name",
	},
	{
		accessorKey: "description",
		header: "Description",
	},
	{
		accessorKey: "version",
		header: "Version",
	},
];
