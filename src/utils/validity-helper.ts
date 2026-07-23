import { Potion } from "@/data/tables/potions";
import { getRegionRealm } from "./data-helper";

const CROW_DOKTOR = "Crow Doktor";
const CROWDOKTOR_FREE_POTION = "Al-Asah's Antidote";

export function isCrowDoktor(archetype?: string) {
	return archetype === CROW_DOKTOR;
}

export function canSelectPotion(potion: Potion, realm?: string, archetype?: string) {
	if (potion.name === 'Charr') console.log('Checking Charr potion for realm:', realm, 'archetype:', archetype, potion);

	const hasRealmLock = !!potion.allowedRealms?.length;
	const hasArchetypeLock = !!potion.allowedArchetypes?.length;
	if (!hasRealmLock && !hasArchetypeLock) return true;

	const realmAllowed = hasRealmLock ? !!realm && !!potion.allowedRealms?.includes(realm) : true;
	const archetypeAllowed = hasArchetypeLock ? !!archetype && !!potion.allowedArchetypes?.includes(archetype) : true;

	return realmAllowed || archetypeAllowed;
}

export function getMandatoryPotions(archetype?: string) {
	return isCrowDoktor(archetype) ? [CROWDOKTOR_FREE_POTION] : [];
}

export function isPotionMandatoryForHero(potionName: string, archetype?: string) {
	return getMandatoryPotions(archetype).includes(potionName);
}

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
