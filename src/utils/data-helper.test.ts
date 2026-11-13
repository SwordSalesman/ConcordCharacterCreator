import { describe, expect, it } from "vitest";
import {
	formatRankedName,
	getArrayFromSummary,
	getDiversificationFromSummary,
	getRankedSummaryFromArray,
	getNextInvestmentOption,
	getSkillData,
	getSkillSummaryFromArray,
	getSkillsFromSummary,
	getSummaryFromArray,
	parseRankedName,
} from "@/utils/data-helper";

describe("ranked names", () => {
	it.each([
		{ input: "Juggernaut (3)", expected: { name: "Juggernaut", rank: 3 } },
		{ input: "Divine Lore Anarch (2)", expected: { name: "Divine Lore Anarch", rank: 2 } },
		{ input: "Leechbane (Ironblood Tonic)", expected: { name: "Leechbane (Ironblood Tonic)" } },
		{ input: "Name (with parentheses) (2)", expected: { name: "Name (with parentheses)", rank: 2 } },
		{ input: "Name (2) suffix", expected: { name: "Name (2) suffix" } },
	])("parses only trailing numeric ranks: $input", ({ input, expected }) => {
		expect(parseRankedName(input)).toEqual(expected);
	});

	it("formats and increments investment ranks", () => {
		expect(formatRankedName("Bloodglass", 2)).toBe("Bloodglass (2)");
		expect(getNextInvestmentOption("Bloodglass")).toBe("Bloodglass (2)");
		expect(getNextInvestmentOption("Bloodglass (2)")).toBe("Bloodglass (3)");
	});
});

describe("summary conversion", () => {
	it("compresses diversification tiers and expands them on load", () => {
		const selections = ["Bloodglass (1)", "Bloodglass (2)", "Essencite (1)"];
		const summary = getRankedSummaryFromArray(selections);
		expect(summary).toBe("Bloodglass (2), Essencite (1)");
		expect(getDiversificationFromSummary(summary!)).toEqual(selections);
	});

	it("loads existing uncompressed and mixed diversification summaries without duplicates", () => {
		expect(getDiversificationFromSummary(
			"Bloodglass (1), Bloodglass (2), Essencite (2)",
		)).toEqual(["Bloodglass (1)", "Bloodglass (2)", "Essencite (1)", "Essencite (2)"]);
	});

	it("compresses to the highest rank regardless of input order", () => {
		expect(getRankedSummaryFromArray([
			"Bloodglass (3)", "Bloodglass (1)", "Bloodglass (2)", "Bloodglass (3)", "Essencite (1)",
		])).toBe("Bloodglass (3), Essencite (1)");
	});

	it("does not interpret ordinary potion names as ranked selections", () => {
		const selections = ["Leechbane (Ironblood Tonic)", "Charr"];
		expect(getArrayFromSummary(getSummaryFromArray(selections)!)).toEqual(selections);
	});

	it("does not expand unknown names or invalid diversification ranks", () => {
		expect(getDiversificationFromSummary(
			"Unknown (3), Bloodglass (0), Bloodglass (10), Bloodglass (9007199254740991)",
		)).toEqual([
			"Unknown (3)", "Bloodglass (0)", "Bloodglass (10)", "Bloodglass (9007199254740991)",
		]);
	});

	it("expands the highest supported diversification rank", () => {
		expect(getDiversificationFromSummary("Bloodglass (9)")).toEqual([
			"Bloodglass (1)", "Bloodglass (2)", "Bloodglass (3)",
			"Bloodglass (4)", "Bloodglass (5)", "Bloodglass (6)",
			"Bloodglass (7)", "Bloodglass (8)", "Bloodglass (9)",
		]);
	});

	it("round-trips empty selections", () => {
		expect(getSummaryFromArray([])).toBe("");
		expect(getArrayFromSummary("")).toEqual([]);
		expect(getSkillsFromSummary("")).toEqual([]);
		expect(getRankedSummaryFromArray([])).toBe("");
		expect(getDiversificationFromSummary("")).toEqual([]);
	});

	it("compresses skill tiers and expands them again from their actual base rank", () => {
		const selections = [
			"Magus", "Additional Mana (1)", "Additional Mana (2)",
			"Divine Lore Anarch (2)", "Divine Lore Anarch (3)",
		];
		const summary = getSkillSummaryFromArray(selections);
		expect(summary).toBe("Magus, Additional Mana (2), Divine Lore Anarch (3)");
		expect(getSkillsFromSummary(summary!)).toEqual(selections);
	});

	it("does not expand non-skill parentheses or unknown ranked names", () => {
		expect(getSkillsFromSummary("Unknown (3), Leechbane (Ironblood Tonic)"))
			.toEqual(["Unknown (3)", "Leechbane (Ironblood Tonic)"]);
	});
});

describe("skill lookup", () => {
	it("derives higher-rank cost and prerequisite from the base skill", () => {
		expect(getSkillData("Juggernaut (3)")).toMatchObject({
			name: "Juggernaut (3)", cost: 6, prereq: "Juggernaut (2)",
			exclusion: "Additional Mana (1)",
		});
	});

	it("keeps fixed-cost tiers at their base cost", () => {
		expect(getSkillData("Additional Spell (3)")).toMatchObject({
			cost: 1, prereq: "Additional Spell (2)",
		});
	});

	it("returns no skill for an unknown name", () => {
		expect(getSkillData("Not a skill")).toBeUndefined();
	});
});
