import { FormState } from "@/context/formContext";
import { Character } from "@/components/approvals/types";
import { getArrayFromSummary } from "@/utils/data-helper";
import { Realm } from "@/data/tables/realms";

/**
 * Converts a Character record (summary/Firestore format, arrays as comma-separated strings)
 * into a FormState (verbose format, arrays as string[]).
 * Used to feed CharacterSheet from the approvals context.
 */
export function characterToFormState(character: Character): FormState {
	return {
		realm: character.realm as Realm | undefined,
		gamesPlayed: character.gamesPlayed ?? 0,
		heroName: character.heroName,
		archetype: character.archetype,
		grace: character.grace,
		warband: character.warband,
		sect: character.sect,
		investment: character.investment,
		invTier: Number(character.invTier ?? 1),
		invOption: character.invOption,
		invDiversify: getArrayFromSummary(character.invDiversify ?? ""),
		invRegion: character.invRegion,
		invTerritory: character.invTerritory,
		skills: getArrayFromSummary(character.skills ?? ""),
		spells: getArrayFromSummary(character.spells ?? ""),
		crafts: getArrayFromSummary(character.crafts ?? ""),
		potions: getArrayFromSummary(character.potions ?? ""),
		ceremonies: getArrayFromSummary(character.ceremonies ?? ""),
		startingItem: character.startingItem,
		backstory: character.backstory,
		invDetails: character.invDetails,
		icGoals: character.icGoals,
		oocGoals: character.oocGoals,
		comments: character.comments,
		changes: [],
	};
}
