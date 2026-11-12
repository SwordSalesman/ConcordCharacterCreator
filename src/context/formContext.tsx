import { createContext, startTransition, useEffect, useMemo, useReducer, useState } from "react";
import React from "react";
import { getGroupList, getUserFormAndApproval } from "../hooks/use-firebase";
import useUserContext from "../hooks/use-user-context";
import {
	getArrayFromSummary,
	getSkillSummaryFromArray,
	getSkillsFromSummary,
	getSummaryFromArray,
} from "../utils/data-helper";
import { Realm } from "@/data/tables/realms";
import {
	applyFieldSideEffects,
	calculateAllowances,
	getChoiceForField,
	getHeroChoices,
	Maximum,
	Remaining,
	normalizeFormState,
} from "@/utils/form-rules";

/*
	FormContext owns form state, loading, and persistence. Pure game rules live in
	hero-rules; UI pages render the choices and allowances exposed by this context.
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

export type { Maximum, Remaining } from "@/utils/form-rules";
export type { RuleChoice } from "@/utils/form-rules";

export interface Approval {
	date: string;
	author: string;
	status: string;
	comment: string;
}

type FormStateSummary = {
	[K in keyof FormState]: FormState[K] extends string[] ? string | undefined : FormState[K];
};

type ArrayField = Exclude<
	{
		[K in keyof FormState]-?: FormState[K] extends string[] ? K : never;
	}[keyof FormState],
	"changes"
>;

type ChoiceField =
	| "investment"
	| "invOption"
	| "invRegion"
	| "invTerritory"
	| "startingItem"
	| "archetype"
	| "grace";

type SetFieldAction = {
	[K in keyof FormState]-?: {
		type: "SET_FIELD";
		field: K;
		value: FormState[K];
	};
}[keyof FormState];

type ToggleItemAction =
	| { type: "TOGGLE_ITEM"; field: ArrayField; item: string }
	| { type: "TOGGLE_ITEM"; field: ChoiceField; item: string | undefined };

type FormAction =
	| { type: "RESET_FORM" }
	| SetFieldAction
	| { type: "SET_FORM"; payload: Partial<FormState> }
	| ToggleItemAction;

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

// Applies form actions in one place, delegating any game-rule normalization to hero-rules.
function formReducer(state: FormState, action: FormAction): FormState {
	switch (action.type) {
		case "SET_FIELD":
			return applyFieldSideEffects({ ...state, [action.field]: action.value }, action.field);
		case "SET_FORM":
			return normalizeFormState({ ...initialState, ...action.payload });
		case "RESET_FORM":
			return initialState;
		case "TOGGLE_ITEM": {
			const { field, item } = action;
			if (item === undefined) {
				if (Array.isArray(state[field])) return state;
				return applyFieldSideEffects({ ...state, [field]: undefined }, field);
			}

			const currentValue = state[field];
			const selected = Array.isArray(currentValue)
				? currentValue.includes(item)
				: currentValue === item;
			const choice = getChoiceForField(state, field, item);
			if (choice && (selected ? !choice.canRemove : !choice.canSelect)) return state;

			const nextValue = Array.isArray(currentValue)
				? selected
					? currentValue.filter((value) => value !== item)
					: [...currentValue, item]
				: selected
					? undefined
					: item;
			return applyFieldSideEffects({ ...state, [field]: nextValue }, field);
		}
		default:
			return state;
	}
}

interface FormContextInterface {
	loading: boolean;
	approval?: Approval;
	form: FormState;
	setField: <K extends keyof FormState>(field: K, value: FormState[K]) => void;
	toggleItem: {
		<K extends ArrayField>(field: K, item: string): void;
		<K extends ChoiceField>(field: K, item: string | undefined): void;
	};
	resetForm: () => void;
	remaining: Remaining;
	maximum: Maximum;
	choices: ReturnType<typeof getHeroChoices>;
	investmentTier: {
		isFirstGame: boolean;
		canIncrease: boolean;
		canDecrease: boolean;
		needsDestroyConfirmation: boolean;
	};
	investmentStatus: {
		warning: string;
		emptyMessage: string;
	};
	investmentRegionWarning: string;
	validateForm: () => {
		valid: boolean;
		validRealm: boolean;
		validName: boolean;
		validInvestment: boolean;
		validBackstory: boolean;
		validInvDetails: boolean;
		validIcGoals: boolean;
		validOocGoals: boolean;
	};
	getFormSummary: () => FormStateSummary;
	bands: { realm: string; name: string }[];
}

export const FormContext = createContext<FormContextInterface>({
	loading: true,
	approval: undefined,
	form: initialState,
	setField: () => {},
	toggleItem: () => {},
	resetForm: () => {},
	remaining: {
		xp: 0,
		spells: 0,
		ceremonies: 0,
		crafts: 0,
		potions: 0,
		invOption: 0,
		diversify: 0,
		startingItem: 0,
	},
	maximum: {
		xp: 0,
		spells: 0,
		ceremonies: 0,
		crafts: 0,
		potions: 0,
		invOption: 0,
		diversify: 0,
		startingItem: 0,
	},
	choices: {
		skills: [],
		investments: [],
		investmentOptions: [],
		diversifyOptions: [],
		regions: [],
		territories: [],
		spells: [],
		crafts: [],
		startingItems: [],
		potions: [],
		ceremonies: [],
	},
	investmentTier: {
		isFirstGame: false,
		canIncrease: false,
		canDecrease: false,
		needsDestroyConfirmation: false,
	},
	investmentStatus: {
		warning: "",
		emptyMessage: "",
	},
	investmentRegionWarning: "",
	validateForm: () => ({
		valid: false,
		validRealm: false,
		validName: false,
		validInvestment: false,
		validBackstory: false,
		validInvDetails: false,
		validIcGoals: false,
		validOocGoals: false,
	}),
	getFormSummary: () => ({}) as FormStateSummary,
	bands: [],
});

// Provides the form state, derived rules, and persistence data consumed across the creator.
export default function FormContextProvider({ children }: { children: React.ReactNode }) {
	const { user } = useUserContext();
	const [loading, setLoading] = useState(true);
	const [approval, setApproval] = useState<Approval | undefined>(undefined);
	const [formState, dispatch] = useReducer(formReducer, initialState);
	const [bands, setBands] = useState<{ realm: string; name: string }[]>([]);

	// Dispatches a type-safe field update through the reducer.
	function setField<K extends keyof FormState>(field: K, value: FormState[K]) {
		dispatch({ type: "SET_FIELD", field, value } as SetFieldAction);
	}

	// Toggles list and single-choice fields; the reducer validates the requested choice.
	function toggleItem<K extends ArrayField>(field: K, item: string): void;
	function toggleItem<K extends ChoiceField>(field: K, item: string | undefined): void;
	function toggleItem(field: ArrayField | ChoiceField, item: string | undefined): void {
		dispatch({ type: "TOGGLE_ITEM", field, item } as ToggleItemAction);
	}

	// Restores the initial blank form.
	function resetForm() {
		dispatch({ type: "RESET_FORM" });
	}

	const { remaining, maximum } = useMemo(() => calculateAllowances(formState), [formState]);
	const choices = useMemo(() => getHeroChoices(formState), [formState]);
	const investmentTier = useMemo(
		() => ({
			isFirstGame: formState.gamesPlayed < 1,
			canIncrease: formState.gamesPlayed > 0 && formState.invTier < 10,
			canDecrease: formState.gamesPlayed > 0 && formState.invTier > 1,
			needsDestroyConfirmation: formState.gamesPlayed > 0 && formState.invTier === 1,
		}),
		[formState.gamesPlayed, formState.invTier],
	);
	const investmentStatus = useMemo(() => {
		const destroyed = formState.invTier === 0;
		const warning = destroyed
			? ""
			: !formState.investment
				? "(None Selected)"
				: remaining.invOption > 0
					? "(Select a variant)"
					: !formState.invRegion
						? "(Select a Region)"
						: !formState.invTerritory
							? "(Select a Territory)"
							: "";
		return {
			warning,
			emptyMessage: destroyed
				? "Your Investment is lost or destroyed"
				: "Select your Investment, as well as any other options you may need.",
		};
	}, [formState, remaining.invOption]);
	const investmentRegionWarning = useMemo(() => {
		if (!formState.realm || !formState.invRegion) return "";
		const regionRealm = choices.regions.find(
			(choice) => choice.value.name === formState.invRegion,
		)?.value.realm;
		return regionRealm !== formState.realm
			? "Your investment is in a region not held by your Realm, so it will function at half capacity."
			: "";
	}, [choices.regions, formState.invRegion, formState.realm]);

	// Converts stored summary strings to in-memory arrays and expands tiered skills.
	function setFormFromSummaryData(summaryForm: FormStateSummary) {
		const payload: Partial<FormState> = {};
		Object.keys(summaryForm).forEach((keyString) => {
			const key = keyString as keyof FormStateSummary;
			const value = summaryForm[key];
			if (key === "skills" && typeof value === "string") {
				payload.skills = getSkillsFromSummary(value);
			} else if (
				value !== undefined &&
				value !== null &&
				Array.isArray(initialState[key]) &&
				typeof value === "string"
			) {
				(payload as Record<string, unknown>)[key] = getArrayFromSummary(value);
			} else if (value !== undefined && value !== null) {
				(payload as Record<string, unknown>)[key] = value;
			} else {
				(payload as Record<string, unknown>)[key] = initialState[key];
			}
		});
		dispatch({ type: "SET_FORM", payload });
	}

	useEffect(() => {
		// Loads the signed-in user's form and group list, or clears account-specific form state.
		async function downloadForm() {
			startTransition(() => setLoading(true));
			const newForm = await getUserFormAndApproval();
			const groupData = await getGroupList();
			if (groupData) setBands(groupData.bands || []);
			setLoading(false);
			if (newForm) {
				setFormFromSummaryData(newForm as unknown as FormStateSummary);
				setApproval(newForm.approval as Approval);
			}
		}

		if (user) {
			downloadForm();
		} else {
			startTransition(() => {
				dispatch({ type: "RESET_FORM" });
				setApproval(undefined);
			});
		}
	}, [user]);

	// Converts the in-memory form back to its persisted summary representation.
	function getFormSummary(): FormStateSummary {
		const summaryForm = {} as FormStateSummary;
		Object.keys(formState).forEach((keyString) => {
			const key = keyString as keyof FormStateSummary;
			const value = formState[key];
			if (Array.isArray(value)) {
				(summaryForm as Record<string, unknown>)[key] =
					key === "skills"
						? getSkillSummaryFromArray(value)
						: (getSummaryFromArray(value) ?? "");
			} else {
				(summaryForm as Record<string, unknown>)[key] = value ?? "";
			}
		});
		return summaryForm;
	}

	// Checks the fields required for submission without treating optional game picks as missing.
	const validateForm = () => {
		const validRealm = !!formState.realm;
		const validName = !!formState.heroName && formState.heroName.trim() !== "";
		const validInvestment =
			formState.invTier === 0 ||
			(!!formState.investment && !!formState.invRegion && !!formState.invTerritory);
		const validBackstory = !!formState.backstory && formState.backstory.trim() !== "";
		const validInvDetails =
			formState.invTier === 0 ||
			(!!formState.invDetails && formState.invDetails.trim() !== "");
		const validIcGoals = !!formState.icGoals && formState.icGoals.trim() !== "";
		const validOocGoals = !!formState.oocGoals && formState.oocGoals.trim() !== "";
		const valid =
			validRealm &&
			validName &&
			validInvestment &&
			validBackstory &&
			validInvDetails &&
			validIcGoals &&
			validOocGoals;
		return {
			valid,
			validRealm,
			validName,
			validInvestment,
			validBackstory,
			validInvDetails,
			validIcGoals,
			validOocGoals,
		};
	};

	const formContext: FormContextInterface = {
		loading,
		approval,
		form: formState,
		bands,
		setField,
		toggleItem,
		resetForm,
		remaining,
		maximum,
		choices,
		investmentTier,
		investmentStatus,
		investmentRegionWarning,
		validateForm,
		getFormSummary,
	};

	return <FormContext.Provider value={formContext}>{children}</FormContext.Provider>;
}
