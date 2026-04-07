import { Archetype } from "@/data/tables/archetypes";
import { getRegionRealm } from "./data-helper";

import { archetypes } from "@/data/tables/archetypes";

export function investmentRegionWarning(realm?: string, invRegion?: string) {
	if (!invRegion || !realm) return "";
	const invRealm = getRegionRealm(invRegion);
	if (realm && invRealm && realm !== invRealm) {
		return "Your investment is in a region not held by your Realm, so it will function at half capacity.";
	}
	return "";
}

export function xpWarning(remainingXp: number) {
	if (remainingXp < 0) {
		return `You have spent ${Math.abs(
			remainingXp,
		)} too much XP! If this is intentional, please provide an explanation in the final submission comments.`;
	}
	return "";
}

export function bandWarning({
	realm,
	warband,
	bands,
}: {
	realm?: string;
	warband?: string;
	bands: { realm: string; name: string }[];
}) {
	const realmicBands = bands.filter((b) => b.realm === realm).map((b) => b.name);
	const warbandInvalid = warband && !realmicBands.includes(warband);
	if (warbandInvalid) {
		return `Your warband "${warband}" is not registered or is spelled incorrectly. Please choose a new option.`;
	}
	return "";
}
