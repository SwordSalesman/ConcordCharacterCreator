import { createContext, useEffect, useReducer, useState } from "react";
import React from "react";
import { getGroup } from "../hooks/use-firebase";
import useUserContext from "../hooks/use-user-context";
import { Realm } from "@/data/tables/realms";

export type GroupType = "Band" | "Sect";

export interface KnightlyOrderDetails {
	tradition?: string;
	traditionType?: string;
	charge?: string;
	structure?: string;
	attitudes?: string;
}

export interface NobleHouseDetails {
	duchy?: string;
	traditions?: string;
	motto?: string;
}

export interface ClanDetails {
	type?: string;
	fire?: string;
	blood?: string;
	law?: string;
}

export interface GuilderDetails {
	guilderArchetype?: string;
	guild?: string;
}

export interface HavenDetails {
	traditions?: string;
}

export interface BoroughDetails {
	toil?: string;
	vigour?: string;
	ironclad?: string;
	citadel?: string;
}

export type ArchetypeDetails =
	| GuilderDetails
	| HavenDetails
	| ClanDetails
	| NobleHouseDetails
	| KnightlyOrderDetails;

export const EnterpriseTypes = [
	"Headquarters",
	"Redoubt",
	"Quartermaster",
	"Bivouac",
	"Cove",
	"Shipyard",
	"Marketplace",
	"Assay",
	"Merchant League",
	"Syndicate",
	"Community",
	"Hunting Lodge",
	"Shrine",
	"Library",
	"Laboratory",
	"Graveyard",
	"Haven",
	"Wealdward",
	"Quarter",
	"Hospitality",
	"Villa",
	"Caravan",
	"Dig",
	"Estate",
	"Keep",
	"Underburrow",
	"Pinnacle",
] as const;
export type EnterpriseType = (typeof EnterpriseTypes)[number];

export interface Enterprise {
	type?: EnterpriseType;
	name?: string;
	description?: string;
}

export interface GroupState {
	date?: string;
	type?: GroupType;
	realm?: Realm;
	name?: string;
	archetype?: string;
	archetypeDetails?: ArchetypeDetails;
	visuals?: string;
	history?: string;
	oath?: string;
	goals?: string;
	enterprise?: Enterprise;
}

interface Approval {
	date: string;
	author: string;
	status: string;
	comment: string;
}

type GroupStateSummary = {
	[K in keyof GroupState]: GroupState[K] extends string[] ? string | undefined : GroupState[K];
};

type SetFieldAction<K extends keyof GroupState> = {
	type: "SET_FIELD";
	field: K;
	value: GroupState[K];
};

type FormAction =
	| { type: "RESET_FORM" }
	| SetFieldAction<keyof GroupState>
	| { type: "SET_FORM"; payload: Partial<GroupState> }
	| { type: "TOGGLE_ITEM"; field: keyof GroupState; item: any };

const initialState: GroupState = {};

// Currently doesn't do anything. Leaving here for future expansion ease.
function applyFieldSideEffects(state: GroupState, field: keyof GroupState): GroupState {
	let newState = { ...state };

	if (field === "archetype") {
		newState = { ...newState, archetypeDetails: undefined };
	}

	return newState;
}

function formReducer(state: GroupState, action: FormAction): GroupState {
	switch (action.type) {
		case "SET_FIELD": {
			const newState = { ...state, [action.field]: action.value };
			return applyFieldSideEffects(newState, action.field);
		}
		case "SET_FORM":
			return { ...initialState, ...action.payload };
		case "RESET_FORM":
			return initialState;
		case "TOGGLE_ITEM": {
			const { field, item } = action;

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

interface GroupContextInterface {
	loading: boolean;
	approval?: Approval;
	group: GroupState;
	setField: (field: keyof GroupState, value: any) => void;
	toggleItem: (field: keyof GroupState, item: any) => void;
	resetForm: () => void;
	validateForm: () => {
		valid: boolean;
	};
	getFormSummary: () => GroupStateSummary;
}

export const GroupContext = createContext<GroupContextInterface>({
	loading: true,
	approval: undefined,
	group: initialState,
	setField: () => {},
	toggleItem: () => {},
	validateForm: () => ({
		valid: false,
	}),
	resetForm: () => {},
	getFormSummary: () => ({}) as GroupStateSummary,
});

export default function GroupContextProvider({
	type,
	children,
}: {
	type: GroupType;
	children: React.ReactNode;
}) {
	const { user } = useUserContext();
	const [loading, setLoading] = useState(true);
	const [approval, setApproval] = useState<Approval | undefined>(undefined);
	const [groupState, dispatch] = useReducer(formReducer, {
		...initialState,
	});

	function setField<K extends keyof GroupState>(field: K, value: GroupState[K]) {
		dispatch({ type: "SET_FIELD", field, value });
	}

	// Toggles an item on or off. Works for both single-value fields (realm, archetype) and
	// array fields (skills, spells). Side effects are handled atomically inside the reducer.
	function toggleItem(field: keyof GroupState, item: any) {
		dispatch({ type: "TOGGLE_ITEM", field, item });
	}

	function resetForm() {
		dispatch({ type: "RESET_FORM" });
	}

	const { realm, name } = groupState;

	// Load Data
	useEffect(() => {
		async function downloadForm() {
			setLoading(true);
			const newForm = await getGroup({ type });
			setLoading(false);
			if (newForm) {
				setFormFromSummaryData({
					...newForm,
				} as unknown as GroupStateSummary);
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

	function setFormFromSummaryData(summaryForm: GroupStateSummary) {
		const payload: Partial<GroupState> = {};
		Object.keys(summaryForm).forEach((k) => {
			const key = k as keyof GroupStateSummary;
			const value = summaryForm[key];
			if (value) {
				(payload as any)[key] = value;
			} else {
				(payload as any)[key] = initialState[key];
			}
		});
		dispatch({ type: "SET_FORM", payload });
	}

	function getFormSummary(): GroupStateSummary {
		const summaryForm: GroupStateSummary = {} as GroupStateSummary;
		Object.keys(groupState).forEach((k) => {
			const key = k as keyof GroupStateSummary;
			const value = groupState[key];
			(summaryForm as any)[key] = value ?? "";
		});
		return summaryForm;
	}

	// Checks if the bare minimum required fields have content in them: Realm, Name, Investment
	const validateForm = () => {
		const validName = !!name && name.trim() !== "";
		return { valid: validName };
	};

	const groupContext: GroupContextInterface = {
		loading,
		approval,
		group: groupState,
		setField,
		toggleItem,
		resetForm,
		validateForm,
		getFormSummary,
	};

	return <GroupContext.Provider value={groupContext}>{children}</GroupContext.Provider>;
}
