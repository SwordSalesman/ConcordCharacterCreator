import { describe, expect, it } from "vitest";
import type { Character } from "@/components/approvals/types";
import { characterToFormState } from "@/utils/character-to-form-state";

const character: Character = {
	id: "test-character",
	heroName: "Test Hero",
	player: "Test Player",
	email: "player@example.invalid",
	date: "2026-01-01T00:00:00.000Z",
	gamesPlayed: 0,
};

describe("characterToFormState", () => {
	it("defaults missing optional selections to empty arrays", () => {
		expect(characterToFormState(character)).toMatchObject({
			gamesPlayed: 0, invTier: 1, heroName: "Test Hero",
			skills: [], spells: [], crafts: [], potions: [], ceremonies: [],
			invDiversify: [], changes: [],
		});
	});

	it("expands compressed skills and diversification tiers", () => {
		const state = characterToFormState({
			...character,
			skills: "Magus, Additional Mana (2)",
			invDiversify: "Bloodglass (2)",
			spells: "Channel Waystone, Heal",
			crafts: "Artisans Oil, Battleplate",
			potions: "Leechbane (Ironblood Tonic)",
			ceremonies: "Freedom of the Soul",
		});
		expect(state).toMatchObject({
			skills: ["Magus", "Additional Mana (1)", "Additional Mana (2)"],
			invDiversify: ["Bloodglass (1)", "Bloodglass (2)"],
			spells: ["Channel Waystone", "Heal"],
			crafts: ["Artisans Oil", "Battleplate"],
			potions: ["Leechbane (Ironblood Tonic)"],
			ceremonies: ["Freedom of the Soul"],
		});
	});

	it.each(["0", 0, "3", 3])("accepts a stored string or numeric tier: %s", (invTier) => {
		expect(characterToFormState({ ...character, invTier }).invTier).toBe(Number(invTier));
	});

	it("preserves narrative and investment fields without normalizing a reviewer's saved sheet", () => {
		const saved: Character = {
			...character, realm: "Andash", archetype: "Crow Doktor", gamesPlayed: 2,
			investment: "Mine", invTier: 2, invOption: "Bloodglass",
			invRegion: "Mukarrem", invTerritory: "The Salt Road", startingItem: "Battleplate",
			backstory: "A backstory", invDetails: "A mine", icGoals: "Explore", oocGoals: "Meet people",
			comments: "Please review", warband: "A band", sect: "A sect", grace: "A grace",
		};
		expect(characterToFormState(saved)).toMatchObject({
			realm: "Andash", archetype: "Crow Doktor", gamesPlayed: 2,
			investment: "Mine", invTier: 2, invOption: "Bloodglass",
			invRegion: "Mukarrem", invTerritory: "The Salt Road", startingItem: "Battleplate",
			backstory: "A backstory", invDetails: "A mine", icGoals: "Explore", oocGoals: "Meet people",
			comments: "Please review", warband: "A band", sect: "A sect", grace: "A grace",
		});
	});
});
