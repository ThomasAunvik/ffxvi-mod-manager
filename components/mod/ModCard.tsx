import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ModConfig } from "@/lib/config/deploy";
import Image from "next/image";

export interface ModCardProps {
	mod: ModConfig;
	toggleMod: (modId: string, enabled: boolean) => void;
}

export const ModCard = (props: ModCardProps) => {
	const { mod, toggleMod } = props;

	return (
		<Card key={`mod-card-${mod.id}`} className="w-72">
			<CardHeader className="p-0">
				<Image
					src={`${mod.logo}`}
					width={200}
					height={200}
					alt={`${mod.name}`}
					objectFit="cover"
				/>
				<CardTitle className="overflow-hidden p-6">{mod.name}</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="flex flex-col gap-2">
					<div>{mod.description}</div>
					<div className="flex items-center space-x-2">
						<Switch
							id={`enable-mod-${mod.id}`}
							defaultChecked={mod.enabled ?? false}
							onCheckedChange={(val) => toggleMod(mod.id, val)}
						/>
						<Label htmlFor={`enable-mod-${mod.id}`}>Enable Mod</Label>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
