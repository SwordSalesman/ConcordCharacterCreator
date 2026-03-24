import { migrateUser } from "../hooks/use-firebase";
import regionMigrationData from "../data/tables/regionMigration.json";

interface MigratableCharacter {
	id: string;
	invTerritory?: string;
	[key: string]: any;
}

export async function handleMigrateInvestments(characters: MigratableCharacter[]) {
	console.log("migrating...");
	console.log(characters);
	if (!characters.length) {
		return;
	}
	characters.forEach(async (c) => {
		console.log(" -> ", c.id);
		if (c.invTerritory) {
			const newTerritory = getMigratedRegion(c.invTerritory);
			if (newTerritory === c.invTerritory) {
				console.log(`    -> 🟢 (${newTerritory})`);
			} else {
				console.log(`    -> 🟡 ${c.invTerritory} -> ${newTerritory}...`);
				const newForm = { ...c, invTerritory: newTerritory };
				const { id, ...newFormWithoutId } = newForm;
				await migrateUser(id, newFormWithoutId);
			}
		} else {
			console.log("    -> 🔴 invTerritory not found");
		}
	});
}

export function getMigratedRegion(oldRegion: string): string {
	return (regionMigrationData as Record<string, string>)[oldRegion] || oldRegion;
}
