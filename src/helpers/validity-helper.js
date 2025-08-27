import { getRegionRealm } from "./data-helper";

export function archetypeWarning(archetype, allArchetypes) {
	if (archetype?.length === 1 && !allArchetypes.map((a) => a.name).includes(archetype[0].name)) {
		return `Your archetype '${archetype[0].name}' is no longer available, please select 'No Archetype' then a new one if you wish.`;
	}
	return "";
}

export function investmentRegionWarning(realm, invRegion) {
	if (!invRegion?.length) return "";
	const invRealm = getRegionRealm(invRegion[0]?.name);
	if (realm && invRealm && realm !== invRealm) {
		return "Your investment is in a region not held by your Realm, so it will function at half capacity.";
	}
	return "";
}

export function xpWarning(remainingXp) {
	if (remainingXp < 0) {
		return `You have spent ${Math.abs(
			remainingXp
		)} too much XP! If this is intentional, please provide an explanation in the final submission comments.`;
	}
	return "";
}
