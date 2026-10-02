export const HERB_IDS = [
	"GS",
	"TB",
	"ST",
	"BR",
	"RK",
	// "BS"
] as const;
export type HerbId = (typeof HERB_IDS)[number];

export const HERB_BASE_UNLOCK_COST = 20;
export const HERB_UNLOCK_COST_SCALE = 2.2;

export interface HerbDefinition {
	id: HerbId;
	name: string;
	emoji: string;
}

export const HERBS: Record<HerbId, HerbDefinition> = {
	GS: {
		id: "GS",
		name: "Green Sunleaf",
		emoji: "🌿",
	},
	TB: {
		id: "TB",
		name: "Throne's Boon",
		emoji: "🌷",
	},
	ST: {
		id: "ST",
		name: "Stone Stem",
		emoji: "🫚",
	},
	BR: {
		id: "BR",
		name: "Beggars Root",
		emoji: "🫜",
	},
	RK: {
		id: "RK",
		name: "Rakoric",
		emoji: "🪻",
	},
	// BS: {
	// 	id: "BS",
	// 	name: "Blacksap",
	// 	emoji: "🫐",
	// },
};

export const HERB_NAME_TO_ID: Record<string, HerbId> = {
	"Green Sunleaf": "GS",
	"Throne's Boon": "TB",
	"Stone Stem": "ST",
	"Beggars Root": "BR",
	Rakoric: "RK",
	// "Blacksap": "BS",
};

export function getHerbName(herbId: HerbId): string {
	return HERBS[herbId].name;
}

export function getHerbId(name: string): HerbId | undefined {
	return HERB_NAME_TO_ID[name];
}
