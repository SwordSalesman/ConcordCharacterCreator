import { createContext, useEffect, useMemo, useReducer, useState } from "react";
import React from "react";
import { getUserFormAndApproval } from "../hooks/use-firebase";
import useUserContext from "../hooks/use-user-context";
import {
	getArrayFromSummary,
	getSkillData,
	getSkillsData,
	getSummaryFromArray,
} from "../utils/data-helper";
import { Realm } from "@/data/tables/realms";

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

interface FormState {
	date?: string;
	realm?: Realm;
	gamesPlayed: number;
	investment?: string;
	invTier: number;
	invOption?: string;
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
}

interface Approval {
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
}

type FormStateSummary = {
	[K in keyof FormState]: FormState[K] extends string[] ? string | undefined : FormState[K];
};

type SetFieldAction<K extends keyof FormState> = {
	type: "SET_FIELD";
	field: K;
	value: FormState[K];
};

type FormAction = { type: "RESET_FORM" } | SetFieldAction<keyof FormState>;

const initialState: FormState = {
	gamesPlayed: 0,
	invTier: 1,
	skills: [],
	spells: [],
	crafts: [],
	potions: [],
	ceremonies: [],
};

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
	remaining: { xp: 0, spells: 0, ceremonies: 0, crafts: 0, potions: 0 },
	getFormSummary: () => ({} as FormStateSummary),
});

export default function FormContextProvider({ children }: { children: React.ReactNode }) {
	const { user } = useUserContext();
	const [loading, setLoading] = useState(true);
	const [approval, setApproval] = useState<Approval | undefined>(undefined);
	const [formState, dispatch] = useReducer(formReducer, initialState);

	function formReducer(state: FormState, action: FormAction): FormState {
		switch (action.type) {
			case "SET_FIELD":
				return { ...state, [action.field]: action.value };
			case "RESET_FORM":
				return initialState;
			default:
				return state;
		}
	}

	// Simple function to set a field to a given value
	function setField<K extends keyof FormState>(field: K, value: FormState[K]) {
		dispatch({ type: "SET_FIELD", field, value });
	}

	// Function to handle 'toggling' an item on or off. Usually because it's displayed as a checkbox.
	// Can toggle both single-value fields (like realm) and multi-value fields (like skills)
	// Single value fields will overwrite/clear, multi-value fields will add/remove from the array.
	function toggleItem<K extends keyof FormState>(field: K, item: any) {
		// Handle side-effects of toggling certain items
		if (field === "realm") setField("archetype", undefined);
		if (field === "investment") setField("invOption", undefined);
		if (field === "invRegion") setField("invTerritory", undefined);
		if (
			field === "spells" &&
			item === "Channel Waystone" &&
			spells.includes("Channel Waystone")
		)
			return;
		if (field === "crafts" && item === "Artisans Oil" && crafts.includes("Artisans Oil"))
			return;

		// Handle the actual toggling
		const currentField = formState[field];
		// Field is an array, add or remove it to the array
		if (Array.isArray(currentField)) {
			if (currentField.includes(item)) {
				dispatch({
					type: "SET_FIELD",
					field,
					value: currentField.filter((i) => i !== item) as FormState[K],
				});
			} else {
				dispatch({
					type: "SET_FIELD",
					field,
					value: [...currentField, item] as FormState[K],
				});
			}
		}
		// Field is a single value, set or clear it
		else {
			if (currentField === item) {
				dispatch({ type: "SET_FIELD", field, value: initialState[field] });
			} else {
				dispatch({ type: "SET_FIELD", field, value: item });
			}
		}
	}

	function resetForm() {
		dispatch({ type: "RESET_FORM" });
	}

	const {
		date,
		realm,
		gamesPlayed,
		skills,
		investment,
		invTier,
		invOption,
		invRegion,
		invTerritory,
		spells,
		crafts,
		potions,
		ceremonies,
		startingItem,
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
		return (
			skills.filter((s) => s.startsWith("Apothecary")).length * 3 +
			skills.filter((s) => s.startsWith("Extra Recipe")).length * 2
		);
	}, [skills]);
	const remainingPotions = maxPotions - potions.length;

	const remaining = {
		xp: remainingXp,
		spells: remainingSpells,
		ceremonies: remainingCeremonies,
		crafts: remainingCrafts,
		potions: remainingPotions,
	};

	// Load Data
	useEffect(() => {
		async function downloadForm() {
			setLoading(true);
			const newForm = await getUserFormAndApproval();
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
		Object.keys(summaryForm).forEach((k) => {
			let key = k as keyof FormStateSummary;
			const value = summaryForm[key];

			if (value) {
				if (initialState[key] instanceof Array && typeof value === "string") {
					setField(key, getArrayFromSummary(value));
				} else {
					setField(key, value);
				}
			} else {
				setField(key, initialState[key]);
			}
		});
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

	// Handling functions

	// Checks if the bare minimum required fields have content in them: Realm, Name, Investment, Backstory
	const validateForm = () => {
		const validRealm = !!realm;
		const validName = !!heroName && heroName.trim() !== "";
		const validInvestment = !!investment && !!invRegion && !!invTerritory;
		const valid = validRealm && validName && validInvestment;
		return { valid, validRealm, validName, validInvestment };
	};

	function validSkillChoice(skill: string): { valid: boolean; reason?: string } {
		const ignoreCost = true;

		const fullSkill = getSkillData(skill);

		if (!fullSkill) return { valid: false, reason: undefined };

		if (!ignoreCost) {
			const notEnoughXP = fullSkill.cost > remainingXp;
			if (notEnoughXP) {
				return { valid: false, reason: "Not enough XP" };
			}
		}

		let prereqNotMet = fullSkill.prereq && !skills?.includes(fullSkill.prereq);
		if (prereqNotMet) {
			return { valid: false, reason: `Prerequisite missing: '${fullSkill.prereq}'` };
		}

		let excluded = fullSkill.exclusion && skills?.includes(fullSkill.exclusion);
		if (excluded) {
			return { valid: false, reason: `Conflicts with '${fullSkill.exclusion}'` };
		}

		return { valid: true, reason: undefined };
	}

	// Enforces some game rules about flow-on effects of skill selection
	useEffect(() => {
		skills?.forEach((s) => {
			const { valid } = validSkillChoice(s);
			// Hard limit at -10 xp to prevent meme submitting all the skills
			if (!valid || remainingXp < -10) {
				toggleItem("skills", s);
			}
		});

		if (!skills?.includes("Magus")) {
			setField("spells", []);
		} else if (!spells.includes("Channel Waystone")) {
			toggleItem("spells", "Channel Waystone");
		}
		if (!skills?.includes("Artisan")) {
			setField("crafts", []);
			setField("startingItem", undefined);
		} else if (!crafts.includes("Artisans Oil")) {
			toggleItem("crafts", "Artisans Oil");
		}
		if (!skills?.includes("Apothecary")) setField("potions", []);
		if (!skills?.find((s) => s.startsWith("Divine Lore"))) setField("ceremonies", []);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [skills, remainingXp]);

	const formContext: FormContextInterface = {
		loading,
		approval: approval || undefined,
		form: formState,
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
