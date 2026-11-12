import { Skill, skills } from "@/data/tables/skills";
import { CivilServiceRealm, realms } from "@/data/tables/realms";
import { regions } from "@/data/tables/regions";
import React, { ReactNode } from "react";

// ########## FORM DATA ##########

export function getSummaryFromArray(a: string[]): string | undefined {
	return a?.join(", ");
}

// Parses only a trailing numeric rank, leaving other parentheses in the name.
export function parseRankedName(value: string): { name: string; rank?: number } {
	const match = value.match(/^(.+) \((\d+)\)$/);
	if (!match) return { name: value };
	const rank = Number(match[2]);
	return Number.isSafeInteger(rank) ? { name: match[1], rank } : { name: value };
}

export function formatRankedName(name: string, rank: number): string {
	return `${name} (${rank})`;
}

export function getSkillSummaryFromArray(a: string[]): string | undefined {
	if (!a) return undefined;
	return a
		.filter((item) => {
			const { name, rank } = parseRankedName(item);
			return !rank || !a.includes(formatRankedName(name, rank + 1));
		})
		.join(", ");
}

export function getArrayFromSummary(s: string): string[] {
	if (!s || s === "") return [];
	return s.split(", ");
}

export function getSkillsFromSummary(s: string): string[] {
	return getArrayFromSummary(s).flatMap(getSkillListFromSummary);
}

export function stringToNode(s: string): ReactNode {
	const lines = s.split("\n");
	const node = lines.map((line, index) => (
		<React.Fragment key={index}>
			{line}
			<br />
		</React.Fragment>
	));
	return node;
}

// ########## SKILLS ##########

const skillData = skills;

// Function to turn something like 'Juggernaut (3)' into ['Juggernaut (1)', 'Juggernaut (2)', 'Juggernaut (3)']
export function getSkillListFromSummary(skill: string): string[] {
	const { name, rank } = parseRankedName(skill);
	if (rank === undefined) return [skill];
	const baseSkill = skillData.find((s) => {
		const parsed = parseRankedName(s.name);
		return parsed.name === name && parsed.rank !== undefined;
	});

	if (!baseSkill) return [skill];
	const { rank: baseRank } = parseRankedName(baseSkill.name);

	if (!baseRank || !rank) return [skill];

	const list: string[] = [];
	for (let i = baseRank; i <= rank; i++) {
		list.push(formatRankedName(name, i));
	}
	return list;
}

export function getSkillData(skill: string): Skill | undefined {
	const { name, rank } = parseRankedName(skill);
	if (rank === undefined) {
		return skillData.find((s) => s.name === skill);
	}

	// Tiered skill, need to find the base skill then count the cost up
	const baseSkill = skillData.find((s) => {
		const parsed = parseRankedName(s.name);
		return parsed.name === name && parsed.rank !== undefined;
	});

	if (!baseSkill) return undefined;
	const { rank: baseRank } = parseRankedName(baseSkill.name);

	if (baseRank === rank || baseRank === undefined || rank === undefined) {
		return baseSkill;
	}

	const ranksAboveBase = rank - baseRank;
	return {
		name: skill,
		tree: baseSkill.tree,
		cost: baseSkill.cost + (baseSkill.costExtra ?? 0) * ranksAboveBase,
		costExtra: baseSkill.costExtra,
		prereq: formatRankedName(name, (rank || 1) - 1),
		exclusion: baseSkill.exclusion,
	};
}

export function getSkillsData(skills: string[]): Skill[] {
	const skillsData: Skill[] = [];
	skills.forEach((skill) => {
		const data = getSkillData(skill);
		if (data) skillsData.push(data);
	});
	return skillsData;
}

export function getNextSkill(skill: Skill): Skill {
	const { name: base, rank } = parseRankedName(skill.name);
	const name = rank === undefined ? base : formatRankedName(base, rank + 1);

	return {
		name: name,
		tree: skill.tree,
		cost: skill.cost + (skill.costExtra ?? 0),
		costExtra: skill.costExtra,
		prereq: skill.name,
		exclusion: skill.exclusion ? skill.exclusion : null,
	};
}

// Takes a string and returns an incremented version.
// "Beastbone" -> "Beastbone (2)"
// "Beastbone (2)" -> "Beastbone (3)"
export function getNextInvestmentOption(option: string): string {
	const { name, rank } = parseRankedName(option);
	return formatRankedName(name, (rank ?? 1) + 1);
}

// ########## REALMS ##########

export function getRealmData(realmName: string) {
	return [...realms, CivilServiceRealm].find((r) => r.name === realmName);
}

export function getRegionRealm(regionName: string) {
	const realm = regions.filter((r) => r.name === regionName)[0]?.realm;
	return realm;
}
