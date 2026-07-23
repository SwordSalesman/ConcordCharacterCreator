import { createContext, useEffect, useMemo, useReducer, useState } from "react";
import React from "react";
import { getGroupList, getUserFormAndApproval } from "../hooks/use-firebase";
import useUserContext from "../hooks/use-user-context";
import {
	getArrayFromSummary,
	getSkillData,
	getSkillsData,
	getSummaryFromArray,
} from "../utils/data-helper";
import { Realm } from "@/data/tables/realms";
import { investments } from "@/data/tables/investments";
import { potions as potionData } from "@/data/tables/potions";
import {
	canSelectPotion,
	getMandatoryPotions,
	isCrowDoktor,
	isPotionMandatoryForHero,
} from "@/utils/validity-helper";

/*
	Form Context
	This file all of the state management for the character form, as well as enforcing some game rules about what can and can't be selected

	***** Definitions *****
		SUMMARY form data:
			- Stored in a way that looks good in a spreadsheet, everything is a string / number / boolean
			- Arrays are stored as comma-separated strings (yes that means anything that goes into lists shouldn't have commas in them)
			- Tiered skills are stored only as the last tier of that skill, i.e. 'Juggernaut (2)'
		VERBOSE form data:
			- Used in memory of the app
			- Stored like the FormState interface below
			- Items are stored only as their 'name' keys. So skills are stored as an array of strings, not full skill objects. If you need
				full objects, you have to look them up from the data tables again. The exception is 'skillsFull', which stores full objects.

	For NOW, the client is doing everything. We'll get the server involved later.

	***** Getting and setting form data from the server *****
		- User login:
			1. Client queries the api for the user's form data
			2. Api server queries firestore for the SUMMARY form data
			3. Api server transforms SUMMARY form data into VERBOSE form data
			4. Api server sends VERBOSE form data to client
		- Submit character:
			1. Client submits VERBOSE form data to api server
			2. Api server transforms VERBOSE form data into SUMMARY form data
			3. Api server calculates the changes between this submission and the user's current submission
			4. Api server saves SUMMARY form data, and the changes made, to firestore
*/

export interface FormState {
	date?: string;
	realm?: Realm;
	gamesPlayed: number;
	investment?: string;
	invTier: number;
	invOption?: string;
	invDiversify: string[];
	invRegion?: string;
	invTerritory?: string;
	skills: string[];
	spells: string[];
	crafts: string[];
	potions: string[];
	ceremonies: string[];
	startingItem?: string;
	heroName?: string;
	archetype?: string;
	grace?: string;
	warband?: string;
	sect?: string;
	icGoals?: string;
	oocGoals?: string;
	backstory?: string;
	invDetails?: string;
	comments?: string;
	changes: string[];
}

export interface Approval {
	date: string;
	author: string;
	status: string;
	comment: string;
}

interface Remaining {
	xp: number;
	spells: number;
	ceremonies: number;
	crafts: number;
	potions: number;
	diversify: number;
}

type FormStateSummary = {
	[K in keyof FormState]: FormState[K] extends string[] ? string | undefined : FormState[K];
};

type SetFieldAction<K extends keyof FormState> = {
	type: "SET_FIELD";
	field: K;
	value: FormState[K];
};

type FormAction =
	| { type: "RESET_FORM" }
	| SetFieldAction<keyof FormState>
	| { type: "SET_FORM"; payload: Partial<FormState> }
	| { type: "TOGGLE_ITEM"; field: keyof FormState; item: any };

const initialState: FormState = {
	gamesPlayed: 0,
	invTier: 1,
	invDiversify: [],
	skills: [],
	spells: [],
	crafts: [],
	potions: [],
	ceremonies: [],
	changes: [],
};

function calculateRemainingDiversifyOptions({
	investment,
	invTier,
	invDiversify,
}: {
	investment: string | undefined;
	invTier: number;
	invDiversify: string[];
}): number {
	const invHasDiversifyOptions = !!investments.find((i) => i.name === investment)
		?.diversifyOptions?.length;
	const remainingDiversifyOptions = invHasDiversifyOptions
		? invTier - 1 - (invDiversify?.length ?? 0)
		: 0;
	return remainingDiversifyOptions;
}

// Pure helper: checks prereqs and exclusions for a single skill against a given skill list.
// Cost is intentionally ignored to allow overspending — see validSkillChoice for where to re-enable that.
function isSkillValid(skill: string, skills: string[]): boolean {
	const fullSkill = getSkillData(skill);
	if (!fullSkill) return false;
	if (fullSkill.prereq && !skills.includes(fullSkill.prereq)) return false;
	if (fullSkill.exclusion && skills.includes(fullSkill.exclusion)) return false;
	return true;
}

// Pure helper: enforces all game rules that flow on from a change to the skills list.
// Runs after any TOGGLE_ITEM on "skills" or SET_FIELD on "gamesPlayed".
function applySkillSideEffects(state: FormState): FormState {
	// Iteratively remove skills that have unmet prereqs or exclusion conflicts,
	// since removing one skill can invalidate another (e.g. a chain of prereqs).
	let skills = [...state.skills];
	let changed = true;
	while (changed) {
		changed = false;
		const valid = skills.filter((s) => isSkillValid(s, skills));
		if (valid.length !== skills.length) {
			skills = valid;
			changed = true;
		}
	}

	// Hard XP cap: remove skills from the end (most recently added) until within -10 XP.
	const computeRemainingXp = (s: string[]) => {
		const fullSkills = getSkillsData(s);
		const used = fullSkills?.map((sk) => sk.cost).reduce((a, b) => a + b, 0) ?? 0;
		return 8 + state.gamesPlayed - used;
	};
	while (computeRemainingXp(skills) < -10 && skills.length > 0) {
		skills = skills.slice(0, -1);
	}

	// Downstream effects: certain skills gate entire sub-systems.
	const hasMagus = skills.includes("Magus");
	const hasArtisan = skills.includes("Artisan");
	const hasApothecary = skills.includes("Apothecary");
	const hasDivineLore = skills.some((s) => s.startsWith("Divine Lore"));

	let spells = state.spells;
	if (!hasMagus) {
		spells = [];
	} else if (!spells.includes("Channel Waystone")) {
		spells = ["Channel Waystone", ...spells];
	}

	let crafts = state.crafts;
	let startingItem = state.startingItem;
	if (!hasArtisan) {
		crafts = [];
		startingItem = undefined;
	} else if (!crafts.includes("Artisans Oil")) {
		crafts = ["Artisans Oil", ...crafts];
	}

	const potions = hasApothecary ? state.potions : [];
	const ceremonies = hasDivineLore ? state.ceremonies : [];

	return { ...state, skills, spells, crafts, startingItem, potions, ceremonies };
}

function applyOptionSideEffects(state: FormState): FormState {
	// For diversification options, need to enforce two rules:
	// 1. Only allow the number of options as your tier allows
	// 2. If a lower option is removed, remove all higher ones (if 2 is removed, remove 3, 4 etc)

	// Enforcing rule 1
	let invDiversify = state.invDiversify;
	const remaining = calculateRemainingDiversifyOptions({
		investment: state.investment,
		invTier: state.invTier,
		invDiversify: state.invDiversify,
	});
	if (remaining < 0) {
		invDiversify = invDiversify.slice(0, remaining);
	}

	// Enforcing rule 2 - prune all hanging 'higher' options.
	// For each base name (e.g. "Bloodglass"), the selected numbers must form a
	// consecutive sequence starting at 1. If (1) is missing, (2) and above are orphans.
	const byBase = new Map<string, number[]>();
	for (const opt of invDiversify) {
		const match = opt.match(/^(.+) \((\d+)\)$/);
		if (match) {
			const base = match[1];
			const num = parseInt(match[2]);
			if (!byBase.has(base)) byBase.set(base, []);
			byBase.get(base)!.push(num);
		}
	}
	invDiversify = invDiversify.filter((opt) => {
		const match = opt.match(/^(.+) \((\d+)\)$/);
		if (!match) return true;
		const nums = byBase.get(match[1])!.sort((a, b) => a - b);
		let maxValid = 0;
		for (let i = 0; i < nums.length; i++) {
			if (nums[i] === i + 1) maxValid = nums[i];
			else break;
		}
		return parseInt(match[2]) <= maxValid;
	});

	return { ...state, invDiversify };
}

function calculateMaxPotions(skills: string[], archetype?: string): number {
	const baseMax =
		skills.filter((s) => s.startsWith("Apothecary")).length * 3 +
		skills.filter((s) => s.startsWith("Extra Recipe")).length * 2 +
		(isCrowDoktor(archetype) ? 1 : 0); // Crows get Al-Asah's Antidote for free, but it doesn't count against their max potions.
	return baseMax;
}

function applyPotionSideEffects(state: FormState): FormState {
	const hasApothecary = state.skills.includes("Apothecary");
	if (!hasApothecary) {
		return { ...state, potions: [] };
	}

	const mandatoryPotions = getMandatoryPotions(state.archetype);
	const allowedPotions = state.potions.filter((name, index, all) => {
		if (all.indexOf(name) !== index) return false;
		const potion = potionData.find((p) => p.name === name);
		if (!potion) return false;
		return canSelectPotion(potion, state.realm, state.archetype);
	});
	const orderedPotions = [...mandatoryPotions, ...allowedPotions];
	const dedupedPotions = orderedPotions.filter((name, index, all) => all.indexOf(name) === index);
	const maxPotions = calculateMaxPotions(state.skills, state.archetype);
	const potions = dedupedPotions.slice(0, maxPotions);

	return { ...state, potions };
}

function normalizeFormState(state: FormState): FormState {
	let normalized = applySkillSideEffects(state);
	normalized = applyOptionSideEffects(normalized);
	normalized = applyPotionSideEffects(normalized);
	return normalized;
}

// Pure helper: applies cascading side effects for any field that has them.
// Called by both SET_FIELD and TOGGLE_ITEM so behaviour is consistent regardless of how a field is set.
function applyFieldSideEffects(state: FormState, field: keyof FormState): FormState {
	const newState = { ...state };
	if (!state.changes.includes(field)) {
		newState.changes = [...state.changes, field];
	}

	if (field === "realm") return normalizeFormState({ ...newState, archetype: undefined });
	if (field === "archetype" || field === "potions") return applyPotionSideEffects(newState);
	if (field === "investment") return { ...newState, invOption: undefined, invDiversify: [] };
	if (field === "invRegion") return { ...newState, invTerritory: undefined };
	if (field === "invDiversify" || field === "invTier") return applyOptionSideEffects(newState);
	if (field === "skills" || field === "gamesPlayed") return normalizeFormState(newState);
	return newState;
}

function formReducer(state: FormState, action: FormAction): FormState {
	switch (action.type) {
		case "SET_FIELD": {
			const newState = { ...state, [action.field]: action.value };
			return applyFieldSideEffects(newState, action.field);
		}
		case "SET_FORM":
			return normalizeFormState({ ...initialState, ...action.payload });
		case "RESET_FORM":
			return initialState;
		case "TOGGLE_ITEM": {
			const { field, item } = action;

			// Channel Waystone and Artisans Oil are mandatory when their parent skill is active.
			// They're added/removed automatically by applySkillSideEffects — not manually.
			if (field === "spells" && item === "Channel Waystone") return state;
			if (field === "crafts" && item === "Artisans Oil") return state;
			if (field === "potions" && isPotionMandatoryForHero(item, state.archetype))
				return state;

			const currentField = state[field];
			let newFieldValue: any;

			if (Array.isArray(currentField)) {
				newFieldValue = currentField.includes(item)
					? currentField.filter((i) => i !== item)
					: [...currentField, item];
			} else {
				newFieldValue = currentField === item ? initialState[field] : item;
			}

			return applyFieldSideEffects({ ...state, [field]: newFieldValue }, field);
		}
		default:
			return state;
	}
}

interface FormContextInterface {
	loading: boolean;
	approval?: Approval;
	form: FormState;
	setField: (field: keyof FormState, value: any) => void;
	toggleItem: (field: keyof FormState, item: any) => void;
	resetForm: () => void;
	remaining: Remaining;
	validateForm: () => {
		valid: boolean;
		validRealm: boolean;
		validName: boolean;
		validInvestment: boolean;
	};
	validSkillChoice: (skill: string) => { valid: boolean; reason?: string };
	getFormSummary: () => FormStateSummary;
	// To do: this bands field shouldn't really be here. It should be in a 'data context' or something, since it's not form state.
	bands: { realm: string; name: string }[];
}

export const FormContext = createContext<FormContextInterface>({
	loading: true,
	approval: undefined,
	form: initialState,
	setField: () => {},
	toggleItem: () => {},
	validateForm: () => ({
		valid: false,
		validRealm: false,
		validName: false,
		validInvestment: false,
	}),
	validSkillChoice: () => ({ valid: false }),
	resetForm: () => {},
	remaining: { xp: 0, spells: 0, ceremonies: 0, crafts: 0, potions: 0, diversify: 0 },
	getFormSummary: () => ({}) as FormStateSummary,
	bands: [],
});

export default function FormContextProvider({ children }: { children: React.ReactNode }) {
	const { user } = useUserContext();
	const [loading, setLoading] = useState(true);
	const [approval, setApproval] = useState<Approval | undefined>(undefined);
	const [formState, dispatch] = useReducer(formReducer, initialState);
	const [bands, setBands] = useState<{ realm: string; name: string }[]>([]);

	function setField<K extends keyof FormState>(field: K, value: FormState[K]) {
		dispatch({ type: "SET_FIELD", field, value });
	}

	// Toggles an item on or off. Works for both single-value fields (realm, archetype) and
	// array fields (skills, spells). Side effects are handled atomically inside the reducer.
	function toggleItem(field: keyof FormState, item: any) {
		dispatch({ type: "TOGGLE_ITEM", field, item });
	}

	function resetForm() {
		dispatch({ type: "RESET_FORM" });
	}

	const {
		realm,
		gamesPlayed,
		skills,
		investment,
		invRegion,
		invTerritory,
		invDiversify,
		invTier,
		spells,
		crafts,
		potions,
		ceremonies,
		heroName,
	} = formState;

	// Derived Variables
	const totalXp = 8 + gamesPlayed;
	const fullSkills = getSkillsData(skills);
	const remainingXp =
		totalXp - (fullSkills ? fullSkills.map((s) => s.cost).reduce((a, b) => a + b, 0) : 0);

	const maxSpells = useMemo(() => {
		if (!skills.includes("Magus")) return 0;
		return 2 + skills.filter((s) => s.startsWith("Additional Spell")).length * 1;
	}, [skills]);
	const remainingSpells = maxSpells - spells.length;

	const maxCeremonies = useMemo(() => {
		return (
			skills.filter((s) => s.startsWith("Divine Lore")).length * 2 +
			skills.filter((s) => s.startsWith("Extra Ceremony")).length * 2
		);
	}, [skills]);
	const remainingCeremonies = maxCeremonies - ceremonies.length;

	const maxCrafts = useMemo(() => {
		return (
			skills.filter((s) => s.startsWith("Artisan")).length * 5 +
			skills.filter((s) => s.startsWith("Extra Craft")).length * 2
		);
	}, [skills]);
	const remainingCrafts = maxCrafts - crafts.length;

	const maxPotions = useMemo(() => {
		return calculateMaxPotions(skills, formState.archetype);
	}, [skills, formState.archetype]);
	const remainingPotions = maxPotions - potions.length;

	const remainingDiversifyOptions = calculateRemainingDiversifyOptions({
		investment,
		invTier,
		invDiversify,
	});

	const remaining: Remaining = {
		xp: remainingXp,
		spells: remainingSpells,
		ceremonies: remainingCeremonies,
		crafts: remainingCrafts,
		potions: remainingPotions,
		diversify: remainingDiversifyOptions,
	};

	// Load Data
	useEffect(() => {
		async function downloadForm() {
			setLoading(true);
			const newForm = await getUserFormAndApproval();

			const groupData = await getGroupList();
			if (groupData) {
				setBands(groupData.bands || []);
			}

			setLoading(false);
			if (newForm) {
				setFormFromSummaryData(newForm as unknown as FormStateSummary);
				setApproval(newForm.approval as Approval);
			}
		}

		if (user) {
			downloadForm();
		} else {
			dispatch({ type: "RESET_FORM" });
			setApproval(undefined);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	function setFormFromSummaryData(summaryForm: FormStateSummary) {
		const payload: Partial<FormState> = {};
		Object.keys(summaryForm).forEach((k) => {
			const key = k as keyof FormStateSummary;
			const value = summaryForm[key];
			if (value) {
				if (initialState[key] instanceof Array && typeof value === "string") {
					(payload as any)[key] = getArrayFromSummary(value);
				} else {
					(payload as any)[key] = value;
				}
			} else {
				(payload as any)[key] = initialState[key];
			}
		});
		dispatch({ type: "SET_FORM", payload });
	}

	function getFormSummary(): FormStateSummary {
		const summaryForm: FormStateSummary = {} as FormStateSummary;
		Object.keys(formState).forEach((k) => {
			const key = k as keyof FormStateSummary;
			const value = formState[key];
			if (Array.isArray(value)) {
				(summaryForm as any)[key] = getSummaryFromArray(value) ?? "";
			} else {
				(summaryForm as any)[key] = value ?? "";
			}
		});
		return summaryForm;
	}

	// Checks if the bare minimum required fields have content in them: Realm, Name, Investment
	const validateForm = () => {
		const validRealm = !!realm;
		const validName = !!heroName && heroName.trim() !== "";
		const validInvestment = !!investment && !!invRegion && !!invTerritory;
		const valid = validRealm && validName && validInvestment;
		return { valid, validRealm, validName, validInvestment };
	};

	// Exposed for UI feedback (e.g. greying out invalid skills on the skills page).
	// Costs are intentionally ignored to allow overspending — change ignoreCost to re-enable.
	function validSkillChoice(skill: string): { valid: boolean; reason?: string } {
		const ignoreCost = true;

		const fullSkill = getSkillData(skill);
		if (!fullSkill) return { valid: false, reason: undefined };

		if (!ignoreCost) {
			const notEnoughXP = fullSkill.cost > remainingXp;
			if (notEnoughXP) return { valid: false, reason: "Not enough XP" };
		}

		if (fullSkill.prereq && !skills?.includes(fullSkill.prereq)) {
			return { valid: false, reason: `Prerequisite missing: '${fullSkill.prereq}'` };
		}

		if (fullSkill.exclusion && skills?.includes(fullSkill.exclusion)) {
			return { valid: false, reason: `Conflicts with '${fullSkill.exclusion}'` };
		}

		return { valid: true, reason: undefined };
	}

	const formContext: FormContextInterface = {
		loading,
		approval,
		form: formState,
		bands,
		setField,
		toggleItem,
		resetForm,
		remaining,
		validateForm,
		validSkillChoice,
		getFormSummary,
	};

	return <FormContext.Provider value={formContext}>{children}</FormContext.Provider>;
}
