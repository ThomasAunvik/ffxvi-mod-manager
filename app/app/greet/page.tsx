"use client";

import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import Link from "next/link";

export default function Greet() {
	const [greeting, setGreeting] = useState("");

	useEffect(() => {
		invoke<string>("greet", { name: "Next.js" })
			.then((result) => setGreeting(result))
			.catch(console.error);
	}, []);

	// Necessary because we will have to use Greet as a component later.
	return (
		<div>
			<div>{greeting}</div>
			<Link href="/">Go back home</Link>
		</div>
	);
}
