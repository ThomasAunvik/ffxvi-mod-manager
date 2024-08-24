"use client";

import { generateModColumns } from "@/components/mod/table/columns";
import { DataTable } from "@/components/mod/table/data-table";
import { ModConfig } from "@/lib/config/deploy";
import {
	ColumnDef,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";

export interface ModTableProps {
	mods: ModConfig[];

	toggleMod: (modId: string, enabled: boolean) => void;
}

export const ModTable = (props: ModTableProps) => {
	const { mods, toggleMod } = props;

	const columns = generateModColumns({ toggleMod });

	return (
		<div className="container py-10">
			<DataTable columns={columns} data={mods} />
		</div>
	);
};
