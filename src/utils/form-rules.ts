import { Ceremony, ceremonies } from "@/data/tables/ceremonies";
import { Craft, crafts } from "@/data/tables/crafts";
import { Investment, investments } from "@/data/tables/investments";
import { Potion, potions } from "@/data/tables/potions";
import { Realm } from "@/data/tables/realms";
import { Region, regions } from "@/data/tables/regions";
import { Skill, skills } from "@/data/tables/skills";
import { Spell, spells } from "@/data/tables/spells";
import type { FormState } from "@/context/formContext";
import {
	formatRankedName,
	getNextInvestmentOption,
	getNextSkill,
	getSkillData,
	getSkillsData,
	parseRankedName,
} from "@/utils/data-helper";
import { canSelectPotion, getMandatoryPotions, isCrowDoktor } from "@/utils/validity-helper";
import { regionIsNotCoastal } from "@/utils/selection-helper";

export interface Remaining {
	xp: number;
	spells: number;
	ceremonies: number;
	crafts: number;
	potions: number;
	invOption: number;
	diversify: number;
	startingItem: number;
}

export type Maximum = Remaining;

export interface RuleChoice<T> {
	value: T;
	selected: boolean;
	canSelect: boolean;
	canRemove: boolean;
	selectReason?: string;
	removeReason?: string;
}

export type Eligibility = { eligible: true } | { eligible: false; reason: string };

export interface HeroChoices {
	skills: RuleChoice<Skill>[];
	investments: RuleChoice<Investment>[];
	investmentOptions: RuleChoice<{ name: string }>[];
	diversifyOptions: RuleChoice<{ name: string }>[];
	regions: RuleChoice<Region>[];
	territories: RuleChoice<string>[];
	spells: RuleChoice<Spell>[];
	crafts: RuleChoice<Craft>[];
	startingItems: RuleChoice<Craft>[];
	potions: RuleChoice<Potion>[];
	ceremonies: RuleChoice<Ceremony>[];
}

export interface Allowances {
	remaining: Remaining;
	maximum: Maximum;
}

// 📖 Potion capacity is 3 per Apothecary tier plus 2 per Extra Recipe tier.
// 📖 Crow Doktors gain one free-potion slot as they get Al Asah's for free: https://wiki.concordlarp.com/index.php/On_the_Value_of_Ignorance
function calculateMaxPotions(skills: string[], archetype?: string): number {
	return (
		skills.filter((skill) => skill.startsWith("Apothecary")).length * 3 +
		skills.filter((skill) => skill.startsWith("Extra Recipe")).length * 2 +
		(isCrowDoktor(archetype) ? 1 : 0)
	);
}

// 📖 The maximum spells you know is 2 for Magus, plus 1 for Additional Spell tier, includes the mandatory choice of Channel Waystone.
function calculateMaxSpells(skills: string[]): number {
	if (!skills.includes("Magus")) return 0;
	return 2 + skills.filter((skill) => skill.startsWith("Additional Spell")).length;
}

// 📖 Craft capacity is 5 per Artisan tier plus 2 per Extra Craft tier, including mandatory Artisans Oil.
function calculateMaxCrafts(skills: string[]): number {
	return (
		skills.filter((skill) => skill.startsWith("Artisan")).length * 5 +
		skills.filter((skill) => skill.startsWith("Extra Craft")).length * 2
	);
}

// 📖 Ceremony capacity is 2 per Divine Lore tier plus 2 per Extra Ceremony tier; ceremonies remain optional.
function calculateMaxCeremonies(skills: string[]): number {
	return (
		skills.filter((skill) => skill.startsWith("Divine Lore")).length * 2 +
		skills.filter((skill) => skill.startsWith("Extra Ceremony")).length * 2
	);
}

// 📖 Investments with diversification allow at most one choice per tier above tier 1.
function calculateMaxDiversifyOptions(state: FormState): number {
	const hasOptions = !!investments.find((item) => item.name === state.investment)
		?.diversifyOptions?.length;
	return hasOptions ? Math.max(0, state.invTier - 1) : 0;
}

// 📖 An investment with variants allows one selected variant.
function calculateMaxInvestmentOptions(state: FormState): number {
	return investments.find((item) => item.name === state.investment)?.options?.length ? 1 : 0;
}

// 📖 The XP allowance starts at 8 and increases by 1 for each game played.
function calculateMaxExperience(state: FormState): number {
	return 8 + state.gamesPlayed;
}

// Calculates all display and enforcement allowances from one form snapshot.
export function calculateAllowances(state: FormState): Allowances {
	const skillsData = getSkillsData(state.skills);
	const maximum: Maximum = {
		xp: calculateMaxExperience(state),
		spells: calculateMaxSpells(state.skills),
		ceremonies: calculateMaxCeremonies(state.skills),
		crafts: calculateMaxCrafts(state.skills),
		potions: calculateMaxPotions(state.skills, state.archetype),
		invOption: calculateMaxInvestmentOptions(state),
		diversify: calculateMaxDiversifyOptions(state),
		startingItem: state.skills.includes("Artisan") ? 1 : 0,
	};
	const usedXp = skillsData.reduce((total, skill) => total + skill.cost, 0);
	const remaining: Remaining = {
		xp: maximum.xp - usedXp,
		spells: maximum.spells - state.spells.length,
		ceremonies: maximum.ceremonies - state.ceremonies.length,
		crafts: maximum.crafts - state.crafts.length,
		potions: maximum.potions - state.potions.length,
		invOption: maximum.invOption - (state.invOption ? 1 : 0),
		diversify: maximum.diversify - state.invDiversify.length,
		startingItem: maximum.startingItem - (state.startingItem ? 1 : 0),
	};
	return { maximum, remaining };
}

const eligible: Eligibility = { eligible: true };

function ineligible(reason: string): Eligibility {
	return { eligible: false, reason };
}

// 📖 A skill requires its prerequisite and cannot conflict with another selected skill.
function skillDependencyEligibility(skill: string, selected: string[]): Eligibility {
	const data = getSkillData(skill);
	if (!data) return ineligible("This skill is unavailable");
	if (data.prereq && !selected.includes(data.prereq)) {
		return ineligible(`Prerequisite missing: '${data.prereq}'`);
	}
	if (data.exclusion && selected.includes(data.exclusion)) {
		return ineligible(`Conflicts with '${data.exclusion}'`);
	}
	return eligible;
}

// 📖 A skill must meet its dependencies and stay within the 10-XP over-spend limit.
function skillEligibility(skill: Skill, state: FormState): Eligibility {
	const dependency = skillDependencyEligibility(skill.name, state.skills);
	if (!dependency.eligible) return dependency;
	const remainingXp = calculateAllowances(state).remaining.xp;
	const { name, rank } = parseRankedName(skill.name);
	let costToAdd = skill.cost;
	if (rank && rank > 1) {
		const previousRank = getSkillData(formatRankedName(name, rank - 1));
		if (previousRank) costToAdd -= previousRank.cost;
	}
	return remainingXp - costToAdd >= -10
		? eligible
		: ineligible("Cannot exceed the 10 XP over-spend limit");
}

// 📖 Investments require a positive tier; Naval investments must be placed in a coastal region.
function investmentEligibility(investment: Investment, state: FormState): Eligibility {
	if (state.invTier <= 0) return ineligible("Cannot select an investment when tier is 0");
	if (investment.name === "Naval" && state.invRegion && regionIsNotCoastal(state.invRegion)) {
		return ineligible("Naval investments must be in coastal regions");
	}
	return eligible;
}

// 📖 Investment variants must belong to the selected investment and require a positive tier.
function investmentOptionEligibility(option: { name: string }, state: FormState): Eligibility {
	if (state.invTier <= 0) return ineligible("Cannot select an option when tier is 0");
	const investment = investments.find((item) => item.name === state.investment);
	return investment?.options?.some((item) => item.name === option.name)
		? eligible
		: ineligible("This option is not available for the selected investment");
}

// 📖 Diversification choices must match the investment, progress consecutively, and stay below the investment tier.
function diversifyEligibility(option: { name: string }, state: FormState): Eligibility {
	if (state.invTier <= 0) return ineligible("Cannot select an option when tier is 0");
	const { name, rank } = parseRankedName(option.name);
	const investment = investments.find((item) => item.name === state.investment);
	if (
		rank === undefined ||
		!investment?.diversifyOptions?.some((item) => item.name === name) ||
		rank <= 0 ||
		rank >= state.invTier
	) {
		return ineligible("This diversification is not available at the current investment tier");
	}
	if (rank > 1 && !state.invDiversify.includes(formatRankedName(name, rank - 1))) {
		return ineligible("Choose the previous diversification tier first");
	}
	return eligible;
}

// 📖 Regions require a positive tier, and Naval investments may use only coastal regions.
function regionEligibility(region: Region, state: FormState): Eligibility {
	if (state.invTier <= 0) return ineligible("Cannot select a region when tier is 0");
	if (state.investment === "Naval" && !region.coastal) {
		return ineligible("Naval investments must be in coastal regions");
	}
	return eligible;
}

// 📖 A territory must belong to the selected region and requires a positive investment tier.
function territoryEligibility(territory: string, state: FormState): Eligibility {
	if (state.invTier <= 0) return ineligible("Cannot select a territory when tier is 0");
	const region = regions.find((item) => item.name === state.invRegion);
	return region?.territories.includes(territory)
		? eligible
		: ineligible("Choose a territory in the selected region");
}

// 📖 Spell choices require Magus; Channel Waystone is separately marked as mandatory.
function spellEligibility(_spell: Spell, state: FormState): Eligibility {
	return state.skills.includes("Magus") ? eligible : ineligible("Requires Magus");
}

// 📖 Craft choices require Artisan; Artisans Oil is separately marked as mandatory.
function craftEligibility(_craft: Craft, state: FormState): Eligibility {
	return state.skills.includes("Artisan") ? eligible : ineligible("Requires Artisan");
}

// 📖 A starting item must be a selected Journeyman craft and the hero must have Artisan.
function startingItemEligibility(item: Craft, state: FormState): Eligibility {
	return state.skills.includes("Artisan") &&
		item.rarity === "Journeyman" &&
		state.crafts.includes(item.name)
		? eligible
		: ineligible("Choose a Journeyman craft while you have Artisan");
}

// 📖 Potion restrictions allow a potion when either its realm or archetype restriction matches.
function potionEligibility(potion: Potion, state: FormState): Eligibility {
	if (!state.skills.includes("Apothecary")) return ineligible("Requires Apothecary");
	if (canSelectPotion(potion, state.realm, state.archetype)) return eligible;
	const restrictions = [
		potion.allowedRealms?.length ? `realm: ${potion.allowedRealms.join(", ")}` : undefined,
		potion.allowedArchetypes?.length
			? `archetype: ${potion.allowedArchetypes.join(", ")}`
			: undefined,
	].filter((restriction): restriction is string => restriction !== undefined);
	return ineligible(`Available only to ${restrictions.join(" or ")}`);
}

// 📖 Ceremony choices are limited to spheres covered by the hero's Divine Lore skills.
function ceremonyEligibility(ceremony: Ceremony, state: FormState): Eligibility {
	const knowsSphere = state.skills.some((skill) =>
		skill.startsWith(`Divine Lore ${ceremony.sphere}`),
	);
	return knowsSphere ? eligible : ineligible(`Requires Divine Lore ${ceremony.sphere}`);
}

// 📖 Prunes invalid skill dependencies, then removes latest-added skills beyond the 10-XP overspend floor.
function normalizeSkills(state: FormState): string[] {
	let selected = [...new Set(state.skills)];
	let changed = true;
	while (changed) {
		changed = false;
		const valid = selected.filter(
			(skill) => skillDependencyEligibility(skill, selected).eligible,
		);
		if (valid.length !== selected.length) {
			selected = valid;
			changed = true;
		}
	}

	const xpLimit = calculateMaxExperience(state) + 10;
	while (
		selected.length &&
		getSkillsData(selected).reduce((total, skill) => total + skill.cost, 0) > xpLimit
	) {
		selected = selected.slice(0, -1);
	}
	return selected;
}

// 📖 Investment tier is 1 before a first game, 0 when destroyed, and capped at 10 afterward; dependent selections must match.
function normalizeInvestment(state: FormState): FormState {
	let invTier = Number.isFinite(state.invTier) ? Math.trunc(state.invTier) : 1;
	invTier = state.gamesPlayed === 0 ? 1 : Math.max(0, Math.min(10, invTier));

	let { investment, invOption, invRegion, invTerritory } = state;
	let invDiversify = [...new Set(state.invDiversify)];
	if (invTier === 0) {
		return {
			...state,
			invTier,
			investment: undefined,
			invOption: undefined,
			invRegion: undefined,
			invTerritory: undefined,
			invDiversify: [],
		};
	}

	const investmentData = investments.find((item) => item.name === investment);
	if (!investmentData) investment = undefined;

	const availableVariants = investmentData?.options?.map((item) => item.name) ?? [];
	if (invOption && !availableVariants.includes(invOption)) invOption = undefined;

	const regionData = regions.find((item) => item.name === invRegion);
	if (invRegion && !regionData) invRegion = undefined;
	if (invTerritory && !regionData?.territories.includes(invTerritory)) invTerritory = undefined;

	if (
		investmentData &&
		!investmentEligibility(investmentData, { ...state, invTier, invRegion }).eligible
	) {
		investment = undefined;
	}

	const diversifyNames = investmentData?.diversifyOptions?.map((item) => item.name) ?? [];
	const validDiversify = invDiversify.filter((selection) => {
		const { name, rank } = parseRankedName(selection);
		return rank !== undefined && diversifyNames.includes(name) && rank > 0 && rank < invTier;
	});
	const byBase = new Map<string, number[]>();
	for (const selection of validDiversify) {
		const { name, rank } = parseRankedName(selection);
		if (rank === undefined) continue;
		const ranks = byBase.get(name) ?? [];
		ranks.push(rank);
		byBase.set(name, ranks);
	}
	invDiversify = validDiversify.filter((selection) => {
		const { name, rank } = parseRankedName(selection);
		const ranks = byBase.get(name) ?? [];
		ranks.sort((a, b) => a - b);
		let highestConsecutiveRank = 0;
		for (let index = 0; index < ranks.length; index++) {
			if (ranks[index] !== index + 1) break;
			highestConsecutiveRank = ranks[index];
		}
		return rank !== undefined && rank <= highestConsecutiveRank;
	});
	invDiversify = invDiversify.slice(
		0,
		calculateMaxDiversifyOptions({ ...state, invTier, investment }),
	);

	const maxVariants = investmentData?.options?.length ? 1 : 0;
	if (!maxVariants) invOption = undefined;

	return {
		...state,
		invTier,
		investment,
		invOption,
		invRegion,
		invTerritory,
		invDiversify,
	};
}

// 📖 Skill-gated options must be eligible, within their allowance, and retain required picks before optional picks.
function normalizeOptions(state: FormState): FormState {
	let normalized = state;
	const spellsAllowed = new Set(spells.map((item) => item.name));
	const craftsAllowed = new Set(crafts.map((item) => item.name));
	const allowances = calculateAllowances(normalized).maximum;

	// 📖 Magus always has Channel Waystone; it counts toward the spell allowance and is kept before optional spells.
	let selectedSpells = normalized.spells
		.filter((name) => spellsAllowed.has(name))
		.filter((name) => {
			const spell = spells.find((item) => item.name === name);
			return !!spell && spellEligibility(spell, normalized).eligible;
		});
	if (normalized.skills.includes("Magus"))
		selectedSpells = ["Channel Waystone", ...selectedSpells];
	selectedSpells = [...new Set(selectedSpells)].slice(0, allowances.spells);

	// 📖 Artisan always has Artisans Oil; it counts toward craft capacity and is kept before optional crafts.
	let selectedCrafts = normalized.crafts
		.filter((name) => craftsAllowed.has(name))
		.filter((name) => {
			const craft = crafts.find((item) => item.name === name);
			return !!craft && craftEligibility(craft, normalized).eligible;
		});
	if (normalized.skills.includes("Artisan")) selectedCrafts = ["Artisans Oil", ...selectedCrafts];
	selectedCrafts = [...new Set(selectedCrafts)].slice(0, allowances.crafts);

	// 📖 Only eligible Apothecary recipes remain; mandatory archetype potions take capacity before optional recipes.
	let selectedPotions = normalized.potions.filter((name) => {
		const potion = potions.find((item) => item.name === name);
		return !!potion && potionEligibility(potion, normalized).eligible;
	});
	if (normalized.skills.includes("Apothecary")) {
		selectedPotions = [...getMandatoryPotions(normalized.archetype), ...selectedPotions];
	}
	selectedPotions = [...new Set(selectedPotions)].slice(0, allowances.potions);

	// 📖 A hero may keep only ceremonies in spheres covered by their Divine Lore skills.
	const selectedCeremonies = normalized.ceremonies
		.filter((name) => {
			const ceremony = ceremonies.find((item) => item.name === name);
			return !!ceremony && ceremonyEligibility(ceremony, normalized).eligible;
		})
		.slice(0, allowances.ceremonies);

	// 📖 A starting item must be a selected Journeyman craft and the hero must have Artisan.
	const startingItemCraft = crafts.find((item) => item.name === normalized.startingItem);
	const startingItem =
		startingItemCraft &&
		startingItemEligibility(startingItemCraft, {
			...normalized,
			crafts: selectedCrafts,
		}).eligible
			? normalized.startingItem
			: undefined;

	normalized = {
		...normalized,
		spells: selectedSpells,
		crafts: selectedCrafts,
		potions: selectedPotions,
		ceremonies: selectedCeremonies,
		startingItem,
	};
	return normalizeInvestment(normalized);
}

// Runs skill normalization before dependent options and investment details.
export function normalizeFormState(state: FormState): FormState {
	return normalizeOptions({
		...state,
		skills: normalizeSkills(state),
	});
}

// Applies field-specific resets and normalizes rule-affecting edits, but not ordinary text fields.
export function applyFieldSideEffects(state: FormState, field: keyof FormState): FormState {
	const nextState = {
		...state,
		changes: state.changes.includes(field) ? state.changes : [...state.changes, field],
	};
	if (field === "realm") {
		nextState.archetype = undefined;
	}
	if (field === "investment") {
		nextState.invOption = undefined;
		nextState.invDiversify = [];
	}
	if (field === "invRegion") nextState.invTerritory = undefined;
	if (
		![
			"realm",
			"gamesPlayed",
			"skills",
			"archetype",
			"investment",
			"invTier",
			"invOption",
			"invDiversify",
			"invRegion",
			"invTerritory",
			"spells",
			"crafts",
			"startingItem",
			"potions",
			"ceremonies",
		].includes(field)
	) {
		return nextState;
	}
	return normalizeFormState(nextState);
}

// Builds the common eligibility result consumed by both pages and reducer actions.
function makeChoice<T>(
	value: T,
	selected: boolean,
	canSelect: boolean,
	selectReason?: string,
	canRemove = true,
	removeReason?: string,
): RuleChoice<T> {
	return { value, selected, canSelect, canRemove, selectReason, removeReason };
}

// Converts rule eligibility and selection capacity into the UI and reducer choice contract.
function choiceForList<T>({
	items,
	selectedNames,
	maximum,
	nameOf,
	eligibilityOf,
	isRequired = () => false,
}: {
	items: T[];
	selectedNames: string[];
	maximum: number;
	nameOf: (item: T) => string;
	eligibilityOf: (item: T) => Eligibility;
	isRequired?: (item: T) => boolean;
}): RuleChoice<T>[] {
	return items.map((item) => {
		const name = nameOf(item);
		const selected = selectedNames.includes(name);
		const eligibility = eligibilityOf(item);
		const atCapacity = selectedNames.length >= maximum;
		return makeChoice(
			item,
			selected,
			selected || (eligibility.eligible && !atCapacity),
			!eligibility.eligible
				? eligibility.reason
				: atCapacity && !selected
					? `Selection limit reached (${maximum})`
					: undefined,
			!isRequired(item),
			isRequired(item) ? `Cannot unlearn ${name}` : undefined,
		);
	});
}

// Exposes base and next-tier skills with prerequisite, exclusion, and hard XP-limit feedback.
function skillChoices(state: FormState): RuleChoice<Skill>[] {
	const selectedSkills = getSkillsData(state.skills);
	const nextSkills = selectedSkills
		.filter((skill) => skill.costExtra !== undefined)
		.map(getNextSkill);
	const candidates = [...skills, ...nextSkills].filter(
		(skill, index, all) =>
			all.findIndex((candidate) => candidate.name === skill.name) === index,
	);
	return candidates.map((skill) => {
		const selected = state.skills.includes(skill.name);
		const eligibility = skillEligibility(skill, state);
		return makeChoice(
			skill,
			selected,
			eligibility.eligible,
			eligibility.eligible ? undefined : eligibility.reason,
		);
	});
}

function investmentChoices(state: FormState): RuleChoice<Investment>[] {
	return choiceForList({
		items: investments,
		selectedNames: state.investment ? [state.investment] : [],
		maximum: 1,
		nameOf: (item) => item.name,
		eligibilityOf: (item) => investmentEligibility(item, state),
	});
}

function investmentOptionChoices(state: FormState): RuleChoice<{ name: string }>[] {
	const investment = investments.find((item) => item.name === state.investment);
	return choiceForList({
		items: investment?.options ?? [],
		selectedNames: state.invOption ? [state.invOption] : [],
		maximum: calculateAllowances(state).maximum.invOption,
		nameOf: (item) => item.name,
		eligibilityOf: (item) => investmentOptionEligibility(item, state),
	});
}

function diversifyCandidates(state: FormState): { name: string }[] {
	const investment = investments.find((item) => item.name === state.investment);
	const firstRanks =
		state.invTier > 1
			? (investment?.diversifyOptions ?? []).map((item) => ({
					name: formatRankedName(item.name, 1),
				}))
			: [];
	const nextRanks = state.invDiversify
		.map((name) => ({ name: getNextInvestmentOption(name) }))
		.filter(
			(item, index, all) =>
				all.findIndex((candidate) => candidate.name === item.name) === index,
		);
	return [...firstRanks, ...nextRanks].filter(
		(item) => diversifyEligibility(item, state).eligible,
	);
}

function diversifyChoices(state: FormState): RuleChoice<{ name: string }>[] {
	return choiceForList({
		items: diversifyCandidates(state),
		selectedNames: state.invDiversify,
		maximum: calculateAllowances(state).maximum.diversify,
		nameOf: (item) => item.name,
		eligibilityOf: (item) => diversifyEligibility(item, state),
	});
}

function regionChoices(state: FormState): RuleChoice<Region>[] {
	return choiceForList({
		items: regions,
		selectedNames: state.invRegion ? [state.invRegion] : [],
		maximum: 1,
		nameOf: (item) => item.name,
		eligibilityOf: (item) => regionEligibility(item, state),
	});
}

function territoryChoices(state: FormState): RuleChoice<string>[] {
	const region = regions.find((item) => item.name === state.invRegion);
	return choiceForList({
		items: region?.territories ?? [],
		selectedNames: state.invTerritory ? [state.invTerritory] : [],
		maximum: 1,
		nameOf: (item) => item,
		eligibilityOf: (item) => territoryEligibility(item, state),
	});
}

function spellChoices(state: FormState): RuleChoice<Spell>[] {
	const items = state.skills.includes("Magus") ? spells : [];
	return choiceForList({
		items,
		selectedNames: state.spells,
		maximum: calculateAllowances(state).maximum.spells,
		nameOf: (item) => item.name,
		eligibilityOf: (item) => spellEligibility(item, state),
		isRequired: (item) => item.name === "Channel Waystone",
	});
}

function craftChoices(state: FormState): RuleChoice<Craft>[] {
	const items = state.skills.includes("Artisan") ? crafts : [];
	return choiceForList({
		items,
		selectedNames: state.crafts,
		maximum: calculateAllowances(state).maximum.crafts,
		nameOf: (item) => item.name,
		eligibilityOf: (item) => craftEligibility(item, state),
		isRequired: (item) => item.name === "Artisans Oil",
	});
}

function startingItemChoices(state: FormState): RuleChoice<Craft>[] {
	return choiceForList({
		items: crafts.filter(
			(item) => item.rarity === "Journeyman" && state.crafts.includes(item.name),
		),
		selectedNames: state.startingItem ? [state.startingItem] : [],
		maximum: 1,
		nameOf: (item) => item.name,
		eligibilityOf: (item) => startingItemEligibility(item, state),
	});
}

function potionChoices(state: FormState): RuleChoice<Potion>[] {
	const items = state.skills.includes("Apothecary") ? potions : [];
	return choiceForList({
		items,
		selectedNames: state.potions,
		maximum: calculateAllowances(state).maximum.potions,
		nameOf: (item) => item.name,
		eligibilityOf: (item) => potionEligibility(item, state),
		isRequired: (item) => getMandatoryPotions(state.archetype).includes(item.name),
	});
}

function ceremonyChoices(state: FormState): RuleChoice<Ceremony>[] {
	return choiceForList({
		items: ceremonies.filter((item) => ceremonyEligibility(item, state).eligible),
		selectedNames: state.ceremonies,
		maximum: calculateAllowances(state).maximum.ceremonies,
		nameOf: (item) => item.name,
		eligibilityOf: (item) => ceremonyEligibility(item, state),
	});
}

// Collects the independently derived candidate lists for the UI and reducer.
export function getHeroChoices(state: FormState): HeroChoices {
	return {
		skills: skillChoices(state),
		investments: investmentChoices(state),
		investmentOptions: investmentOptionChoices(state),
		diversifyOptions: diversifyChoices(state),
		regions: regionChoices(state),
		territories: territoryChoices(state),
		spells: spellChoices(state),
		crafts: craftChoices(state),
		startingItems: startingItemChoices(state),
		potions: potionChoices(state),
		ceremonies: ceremonyChoices(state),
	};
}

// Finds the context-derived decision for a requested field/value toggle.
export function getChoiceForField(
	state: FormState,
	field: keyof FormState,
	name: string,
): RuleChoice<unknown> | undefined {
	const choices = getHeroChoices(state);
	const byName: Partial<Record<keyof FormState, RuleChoice<unknown>[]>> = {
		skills: choices.skills,
		investment: choices.investments,
		invOption: choices.investmentOptions,
		invDiversify: choices.diversifyOptions,
		invRegion: choices.regions,
		invTerritory: choices.territories,
		spells: choices.spells,
		crafts: choices.crafts,
		startingItem: choices.startingItems,
		potions: choices.potions,
		ceremonies: choices.ceremonies,
	};
	return byName[field]?.find(
		({ value }) =>
			value === name ||
			(typeof value === "object" && value !== null && "name" in value && value.name === name),
	);
}
