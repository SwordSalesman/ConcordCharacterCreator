import { describe, expect, it } from "vitest";
import type { FormState } from "@/context/formContext";
import { getDiversificationFromSummary, getRankedSummaryFromArray } from "@/utils/data-helper";
import {
	applyFieldSideEffects,
	calculateAllowances,
	getChoiceForField,
	getHeroChoices,
	normalizeFormState,
} from "@/utils/form-rules";

function form(overrides: Partial<FormState> = {}): FormState {
	return {
		gamesPlayed: 0,
		invTier: 1,
		invDiversify: [],
		skills: [],
		spells: [],
		crafts: [],
		potions: [],
		ceremonies: [],
		changes: [],
		...overrides,
	};
}

describe("allowances", () => {
	it("starts with 8 XP and no skill-gated slots", () => {
		expect(calculateAllowances(form())).toEqual({
			maximum: {
				xp: 8, spells: 0, ceremonies: 0, crafts: 0, potions: 0,
				invOption: 0, diversify: 0, startingItem: 0,
			},
			remaining: {
				xp: 8, spells: 0, ceremonies: 0, crafts: 0, potions: 0,
				invOption: 0, diversify: 0, startingItem: 0,
			},
		});
	});

	it("adds one XP per game and subtracts the cost of each learned skill tier", () => {
		const state = form({
			gamesPlayed: 3,
			skills: ["Magus", "Additional Mana (1)", "Additional Mana (2)"],
		});
		expect(calculateAllowances(state)).toMatchObject({
			maximum: { xp: 11 },
			remaining: { xp: 4 },
		});
	});

	it("counts extra spell, craft, recipe and ceremony tiers", () => {
		const state = form({
			skills: [
				"Magus", "Additional Spell (1)", "Additional Spell (2)",
				"Artisan", "Extra Craft (1)",
				"Apothecary", "Extra Recipe (1)", "Extra Recipe (2)",
				"Divine Lore Anarch (2)", "Divine Lore Anarch (3)", "Extra Ceremony (1)",
			],
		});
		expect(calculateAllowances(state).maximum).toMatchObject({
			spells: 4, crafts: 7, potions: 7, ceremonies: 6, startingItem: 1,
		});
	});

	it("counts mandatory choices against capacity and gives Crow Doktors one extra potion slot", () => {
		const state = normalizeFormState(form({
			skills: ["Magus", "Artisan", "Apothecary"],
			archetype: "Crow Doktor",
		}));
		expect(calculateAllowances(state).remaining).toMatchObject({
			spells: 1, crafts: 4, potions: 3,
		});
	});

	it("allows one investment variant and one diversification per tier above the first", () => {
		expect(calculateAllowances(form({
			investment: "Mine", invOption: "Bloodglass",
		}))).toMatchObject({
			maximum: { invOption: 1, diversify: 0 },
			remaining: { invOption: 0 },
		});
		expect(calculateAllowances(form({
			investment: "Business", invTier: 4,
			invDiversify: ["Bloodglass (1)", "Bloodglass (2)"],
		}))).toMatchObject({
			maximum: { invOption: 0, diversify: 3 },
			remaining: { diversify: 1 },
		});
	});
});

describe("skill rules", () => {
	it("rejects a skill without its prerequisite", () => {
		expect(getChoiceForField(form(), "skills", "Battle Mage")).toMatchObject({
			canSelect: false, selectReason: "Prerequisite missing: 'Magus'",
		});
		expect(getChoiceForField(form({ skills: ["Magus"] }), "skills", "Battle Mage"))
			.toMatchObject({ canSelect: true });
	});

	it("rejects mutually exclusive skills", () => {
		const state = form({ skills: ["Magus", "Battle Mage"] });
		expect(getChoiceForField(state, "skills", "Bloodmage")).toMatchObject({
			canSelect: false, selectReason: "Conflicts with 'Battle Mage'",
		});
	});

	it.each([
		{ gamesPlayed: 0, allowed: false },
		{ gamesPlayed: 1, allowed: true },
	])("enforces the exact -10 XP selection boundary with $gamesPlayed games", ({ gamesPlayed, allowed }) => {
		const state = form({
			gamesPlayed,
			skills: ["Magus", "Artisan", "Apothecary", "Archer", "Bulwark"],
		});
		expect(getChoiceForField(state, "skills", "Battle Mage"))
			.toMatchObject({ canSelect: allowed });
	});

	it("offers the next tier only after its previous tier is learned", () => {
		const state = form({ skills: ["Juggernaut (1)"] });
		expect(getChoiceForField(state, "skills", "Juggernaut (2)"))
			.toMatchObject({ canSelect: true });
		expect(getChoiceForField(state, "skills", "Juggernaut (3)")).toBeUndefined();
	});

	it("recursively prunes dependent tiers when their base skill is removed", () => {
		const state = form({
			skills: ["Additional Mana (1)", "Additional Mana (2)", "Additional Mana (3)", "Archer"],
		});
		expect(normalizeFormState(state).skills).toEqual(["Archer"]);
	});

	it("removes unknown and duplicate skills", () => {
		expect(normalizeFormState(form({
			skills: ["Magus", "Magus", "Not a skill"],
		})).skills).toEqual(["Magus"]);
	});

	it("prunes the latest-added skills beyond the overspend floor", () => {
		const state = form({
			skills: ["Magus", "Artisan", "Apothecary", "Archer", "Bulwark", "Battle Mage"],
		});
		expect(normalizeFormState(state).skills)
			.toEqual(["Magus", "Artisan", "Apothecary", "Archer", "Bulwark"]);
	});
});

describe("skill-gated options", () => {
	it("retains Channel Waystone before optional spells and removes excess and unknown spells", () => {
		const state = normalizeFormState(form({
			skills: ["Magus"],
			spells: ["Not a spell", "Heal", "Detect Magic", "Heal"],
		}));
		expect(state.spells).toEqual(["Channel Waystone", "Heal"]);
		expect(getChoiceForField(state, "spells", "Channel Waystone"))
			.toMatchObject({ selected: true, canRemove: false });
		expect(getChoiceForField(state, "spells", "Heal"))
			.toMatchObject({ selected: true, canRemove: true });
		expect(getChoiceForField(state, "spells", "Detect Magic"))
			.toMatchObject({ canSelect: false, selectReason: "Selection limit reached (2)" });
	});

	it("retains Artisans Oil before optional crafts at capacity", () => {
		const state = normalizeFormState(form({
			skills: ["Artisan"],
			crafts: ["Battleplate", "Bonebreaker", "Boulders Staff", "Clerics Mace", "Death Icon"],
		}));
		expect(state.crafts)
			.toEqual(["Artisans Oil", "Battleplate", "Bonebreaker", "Boulders Staff", "Clerics Mace"]);
		expect(getChoiceForField(state, "crafts", "Artisans Oil"))
			.toMatchObject({ selected: true, canRemove: false });
	});

	it("clears options and the starting item when their skills are absent", () => {
		const state = normalizeFormState(form({
			spells: ["Channel Waystone"], crafts: ["Battleplate"],
			potions: ["Al-Asah's Antidote"], ceremonies: ["Freedom of the Soul"],
			startingItem: "Battleplate",
		}));
		expect(state).toMatchObject({
			spells: [], crafts: [], potions: [], ceremonies: [], startingItem: undefined,
		});
		expect(getHeroChoices(state)).toMatchObject({
			spells: [], crafts: [], potions: [], ceremonies: [], startingItems: [],
		});
	});

	it.each([
		{ selectedCrafts: ["Battleplate"], startingItem: "Battleplate", expected: "Battleplate" },
		{ selectedCrafts: [], startingItem: "Battleplate", expected: undefined },
		{ selectedCrafts: ["Not a craft"], startingItem: "Not a craft", expected: undefined },
		{
			selectedCrafts: ["Apprentices Reliquary"],
			startingItem: "Apprentices Reliquary",
			expected: undefined,
		},
	])("requires the starting item to be a known selected craft: $startingItem / $selectedCrafts", ({
		selectedCrafts, startingItem, expected,
	}) => {
		expect(normalizeFormState(form({
			skills: ["Artisan"], crafts: selectedCrafts, startingItem,
		})).startingItem).toBe(expected);
	});

	it.each([
		{ realm: "Lerona Mere" as const, archetype: undefined, allowed: true },
		{ realm: "Andash" as const, archetype: "Crow Doktor", allowed: true },
		{ realm: "Andash" as const, archetype: undefined, allowed: false },
	])("allows restricted potions by realm OR archetype: $realm / $archetype", ({
		realm, archetype, allowed,
	}) => {
		const state = form({ skills: ["Apothecary"], realm, archetype, potions: ["Boarders Breath"] });
		expect(getChoiceForField(state, "potions", "Boarders Breath"))
			.toMatchObject({ canSelect: true, selected: true });
		expect(normalizeFormState(state).potions.includes("Boarders Breath")).toBe(allowed);
		expect(getChoiceForField({ ...state, potions: [] }, "potions", "Boarders Breath"))
			.toMatchObject({ canSelect: allowed });
	});

	it("keeps the Crow Doktor's mandatory potion ahead of optional recipes", () => {
		const state = normalizeFormState(form({
			skills: ["Apothecary"], archetype: "Crow Doktor",
			potions: ["Arcmages Spirit", "Charr", "Boarders Breath", "Stormseeker"],
		}));
		expect(state.potions)
			.toEqual(["Al-Asah's Antidote", "Arcmages Spirit", "Charr", "Boarders Breath"]);
		expect(getChoiceForField(state, "potions", "Al-Asah's Antidote"))
			.toMatchObject({ canRemove: false });
	});

	it("keeps only ceremonies in known spheres and within capacity", () => {
		const state = normalizeFormState(form({
			skills: ["Divine Lore Anarch (2)"],
			ceremonies: ["Not a ceremony", "Freedom of the Soul", "Anarchic Missive", "Explosive Force"],
		}));
		expect(state.ceremonies).toEqual(["Freedom of the Soul", "Anarchic Missive"]);
		const choices = getHeroChoices(state).ceremonies;
		expect(choices.length).toBeGreaterThan(0);
		expect(choices.every(({ value }) => value.sphere === "Anarch")).toBe(true);
		expect(getChoiceForField(state, "ceremonies", "Explosive Force"))
			.toMatchObject({ canSelect: false });
	});
});

describe("investment rules", () => {
	it("round-trips compressed diversification through load, normalization and save", () => {
		const state = normalizeFormState(form({
			gamesPlayed: 1, investment: "Business", invTier: 4,
			invDiversify: getDiversificationFromSummary("Bloodglass (2), Essencite (1)"),
		}));
		expect(state.invDiversify).toEqual(["Bloodglass (1)", "Bloodglass (2)", "Essencite (1)"]);
		expect(calculateAllowances(state).remaining.diversify).toBe(0);
		expect(getRankedSummaryFromArray(state.invDiversify)).toBe("Bloodglass (2), Essencite (1)");
	});

	it("does not restore removed prerequisites during live normalization", () => {
		const state = normalizeFormState(form({
			gamesPlayed: 1, investment: "Business", invTier: 4,
			invDiversify: getDiversificationFromSummary("Bloodglass (3)")
				.filter((name) => name !== "Bloodglass (2)"),
		}));
		expect(state.invDiversify).toEqual(["Bloodglass (1)"]);
		expect(getRankedSummaryFromArray(state.invDiversify)).toBe("Bloodglass (1)");
	});

	it("trims loaded diversification when the investment tier is reduced", () => {
		const state = applyFieldSideEffects(form({
			gamesPlayed: 1, investment: "Business", invTier: 2,
			invDiversify: getDiversificationFromSummary("Bloodglass (3)"),
		}), "invTier");
		expect(state.invDiversify).toEqual(["Bloodglass (1)"]);
		expect(calculateAllowances(state).remaining.diversify).toBe(0);
	});

	it.each([
		{ gamesPlayed: 0, invTier: 0, expected: 1 },
		{ gamesPlayed: 0, invTier: 9, expected: 1 },
		{ gamesPlayed: 1, invTier: -1, expected: 0 },
		{ gamesPlayed: 1, invTier: 11, expected: 10 },
		{ gamesPlayed: 1, invTier: 3.9, expected: 3 },
		{ gamesPlayed: 1, invTier: Number.NaN, expected: 1 },
	])("normalizes tier $invTier after $gamesPlayed games to $expected", ({
		gamesPlayed, invTier, expected,
	}) => {
		expect(normalizeFormState(form({ gamesPlayed, invTier })).invTier).toBe(expected);
	});

	it("clears all dependent fields when an investment is destroyed", () => {
		const state = normalizeFormState(form({
			gamesPlayed: 1, invTier: 0, investment: "Business", invOption: "Bloodglass",
			invRegion: "Mukarrem", invTerritory: "The Salt Road", invDiversify: ["Bloodglass (1)"],
		}));
		expect(state).toMatchObject({
			investment: undefined, invOption: undefined, invRegion: undefined,
			invTerritory: undefined, invDiversify: [],
		});
		expect(getChoiceForField(state, "investment", "Business"))
			.toMatchObject({ canSelect: false });
	});

	it.each([
		{ invRegion: "Mukarrem", allowed: true },
		{ invRegion: "The Tribelands", allowed: false },
	])("allows Naval only in coastal regions: $invRegion", ({ invRegion, allowed }) => {
		const state = form({ invRegion });
		expect(getChoiceForField(state, "investment", "Naval"))
			.toMatchObject({ canSelect: allowed });
		expect(normalizeFormState({ ...state, investment: "Naval" }).investment)
			.toBe(allowed ? "Naval" : undefined);
		expect(getChoiceForField(form({ investment: "Naval" }), "invRegion", invRegion))
			.toMatchObject({ canSelect: allowed });
	});

	it("removes variants and territories that do not belong to their parents", () => {
		expect(normalizeFormState(form({
			investment: "Mine", invOption: "Hartwood",
			invRegion: "Mukarrem", invTerritory: "True Wilds",
		}))).toMatchObject({ invOption: undefined, invTerritory: undefined });
		expect(normalizeFormState(form({
			investment: "Mine", invOption: "Bloodglass",
			invRegion: "Mukarrem", invTerritory: "The Salt Road",
		}))).toMatchObject({ invOption: "Bloodglass", invTerritory: "The Salt Road" });
	});

	it("keeps consecutive diversification tiers and prunes gaps, duplicates and foreign resources", () => {
		const state = normalizeFormState(form({
			gamesPlayed: 1, investment: "Business", invTier: 4,
			invDiversify: [
				"Bloodglass (1)", "Bloodglass (2)", "Bloodglass (2)",
				"Forgesteel (2)", "Hartwood (1)", "Essencite (4)",
			],
		}));
		expect(state.invDiversify).toEqual(["Bloodglass (1)", "Bloodglass (2)"]);
		expect(getChoiceForField(state, "invDiversify", "Bloodglass (3)"))
			.toMatchObject({ canSelect: true });
		expect(getChoiceForField(state, "invDiversify", "Bloodglass (4)")).toBeUndefined();
	});

	it("caps diversification across different resources at tier minus one", () => {
		const state = normalizeFormState(form({
			gamesPlayed: 1, investment: "Business", invTier: 3,
			invDiversify: ["Bloodglass (1)", "Forgesteel (1)", "Essencite (1)"],
		}));
		expect(state.invDiversify).toEqual(["Bloodglass (1)", "Forgesteel (1)"]);
		expect(getChoiceForField(state, "invDiversify", "Essencite (1)"))
			.toMatchObject({ canSelect: false });
	});
});

describe("form field side effects", () => {
	it("clears the archetype on realm change", () => {
		expect(applyFieldSideEffects(form({
			realm: "Andash", archetype: "Crow Doktor",
		}), "realm")).toMatchObject({ archetype: undefined, changes: ["realm"] });
	});

	it("clears variant and diversification on investment change", () => {
		expect(applyFieldSideEffects(form({
			investment: "Mine", invOption: "Bloodglass", invDiversify: ["Bloodglass (1)"],
		}), "investment")).toMatchObject({ invOption: undefined, invDiversify: [] });
	});

	it("clears the territory on region change even when the territory would still be valid", () => {
		expect(applyFieldSideEffects(form({
			invRegion: "Mukarrem", invTerritory: "The Salt Road",
		}), "invRegion").invTerritory).toBeUndefined();
	});

	it("normalizes dependent options on skill changes", () => {
		expect(applyFieldSideEffects(form({ spells: ["Heal"] }), "skills"))
			.toMatchObject({ spells: [], changes: ["skills"] });
	});

	it("tracks text edits once without pruning unrelated game choices", () => {
		const state = form({ heroName: "A hero", spells: ["Heal"], changes: ["heroName"] });
		expect(applyFieldSideEffects(state, "heroName")).toEqual(state);
	});

	it("does not mutate input state and normalization is idempotent", () => {
		const state = form({
			gamesPlayed: 1, skills: ["Magus", "Artisan", "Apothecary"],
			archetype: "Crow Doktor", spells: ["Heal"], crafts: ["Battleplate"],
			investment: "Business", invTier: 3,
			invDiversify: ["Bloodglass (1)", "Bloodglass (2)"],
		});
		const before = structuredClone(state);
		const normalized = normalizeFormState(state);
		expect(normalizeFormState(normalized)).toEqual(normalized);
		applyFieldSideEffects(state, "realm");
		expect(state).toEqual(before);
	});
});
