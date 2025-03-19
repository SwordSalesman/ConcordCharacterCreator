import { migrateUser } from "../hooks/use-firebase";

var regionMigrationData = require("../data/tables/regionMigration.json");

export async function handleMigrateInvestments(characters) {
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

export function getMigratedRegion(oldRegion) {
	return regionMigrationData[oldRegion] || oldRegion;
}
