"use client";
import { MainTopBar } from "@/components/navigation/MainTopbar";
import { ModeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { interopPackListFiles } from "@/interop/pack";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
	const [result, setResult] = useState("No list found");

	useEffect(() => {
		interopPackListFiles("0003.h.pac").then((res) => {
			setResult(res);
		});
	}, []);

	return (
		<main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
			<div className="flex items-center">
				<h1 className="font-semibold text-lg md:text-2xl">Installed Mods</h1>
			</div>
			<div
				className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
				x-chunk="dashboard-02-chunk-1"
			>
				<div className="flex flex-col items-center gap-1 text-center">
					<h3 className="font-bold text-2xl tracking-tight">
						You have no mods installed
					</h3>
					{result}
					<Button className="mt-4" asChild>
						<Link href="/browse">Add Mod</Link>
					</Button>
				</div>
			</div>
		</main>
	);
}
