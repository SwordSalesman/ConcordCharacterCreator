import { Skill, skills } from "@/data/tables/skills";
import { realms } from "@/data/tables/realms";
import { regions } from "@/data/tables/regions";
import React, { ReactNode } from "react";

// ########## FORM DATA ##########

export function getSummaryFromArray(a: string[]): string | undefined {
	if (!a) return undefined;
	return a
		.filter((item) => {
			// Check for tiered skills, then only keep the highest tier
			if (item.includes("(")) {
				const baseName = item.split(" (")[0];
				const count = parseInt(item.split("(")[1].split(")")[0]);
				return !a.includes(`${baseName} (${count + 1})`);
			}
			return true;
		})
		.join(", ");
}

export function getArrayFromSummary(s: string): string[] {
	if (!s || s === "") return [];
	const items = s.split(", ");
	const allItems: string[] = [];
	items.forEach((item) => {
		// For items like "Juggernaut (3)", need to add "Juggernaut (1)" and "Juggernaut (2)" to allItems
		if (item.includes("(")) {
			allItems.push(...getSkillListFromSummary(item));
		} else {
			allItems.push(item);
		}
	});
	return allItems;
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
	const { name, rank } = getSkillNameAndRank(skill);
	const baseSkill = skillData.find((s) => s.name.startsWith(`${name} (`));

	if (!baseSkill) return [skill];
	const { rank: baseRank } = getSkillNameAndRank(baseSkill.name);

	if (!baseRank || !rank) return [skill];

	const list: string[] = [];
	for (let i = baseRank; i <= rank; i++) {
		list.push(`${name} (${i})`);
	}
	return list;
}

export function getSkillNameAndRank(skill: string): { name: string; rank?: number } {
	if (!skill.includes("(")) {
		return { name: skill };
	}
	const name = skill.split(" (")[0];
	const rank = parseInt(skill.split(" (")[1].split(")")[0]);
	return { name, rank };
}

export function getSkillData(skill: string): Skill | undefined {
	// Not-tiered skill, simple lookup
	if (!skill.includes("(")) {
		return skillData.find((s) => s.name === skill);
	}

	// Tiered skill, need to find the base skill then count the cost up
	const { name, rank } = getSkillNameAndRank(skill);
	const baseSkill = skillData.find((s) => s.name.startsWith(`${name} (`));

	if (!baseSkill) return undefined;
	const { rank: baseRank } = getSkillNameAndRank(baseSkill.name);

	if (baseRank === rank || baseRank === undefined || rank === undefined) {
		return baseSkill;
	}

	const ranksAboveBase = rank - baseRank;
	return {
		name: skill,
		tree: baseSkill.tree,
		cost: baseSkill.cost + (baseSkill.costExtra ?? 0) * ranksAboveBase,
		costExtra: baseSkill.costExtra,
		prereq: `${name} (${(rank || 1) - 1})`,
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
	const parts = skill.name.split(" (");
	const base = parts[0];
	let name = base;
	if (parts.length > 1) {
		const num = parts[1].split(")")[0];
		const newNum = Number.parseInt(num) + 1;
		name = `${base} (${newNum})`;
	}

	return {
		name: name,
		tree: skill.tree,
		cost: skill.cost + (skill.costExtra ?? 0),
		costExtra: skill.costExtra,
		prereq: skill.name,
		exclusion: skill.exclusion ? skill.exclusion : null,
	};
}

// ########## REALMS ##########

export function getRealmData(realmName: string) {
	return realms.find((r) => r.name === realmName);
}

export function getRegionRealm(regionName: string) {
	const realm = regions.filter((r) => r.name === regionName)[0]?.realm;
	return realm;
}
