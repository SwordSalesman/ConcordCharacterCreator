import type { HerbId } from "./herbs";

export type Tag = "health" | "cleansing" | "mana" | "energy" | "divine" | "weird";

export interface PotionDefinition {
	id: PotionId;
	name: string;
	sellValue: number;
	unlockBaseCost: number;
	recipe: Partial<Record<HerbId, number>>;
	tier: number;
	tags: Tag[];
}

export const POTION_IDS = [
	"EV",
	"CS",
	"BB",
	"FA",
	"AA",
	"BE",
	"WB",
	"GM",
	"LB",
	"KS",
	"MB",
	"AS",
	"BQ",
	// "CH",
	"CB",
	"CN",
	"CA",
	"FS",
	"RS",
	"SF",
	"SB",
	"SS",
	"TA",
	"VD",
] as const;
export type PotionId = (typeof POTION_IDS)[number];

export const POTION_UNLOCK_COST_SCALE = 1.25;

export const POTIONS: Record<PotionId, PotionDefinition> = {
	EV: {
		id: "EV",
		name: "Elixir Vitae",
		sellValue: 3,
		unlockBaseCost: 20,
		recipe: {
			GS: 1,
			TB: 1,
		},
		tier: 1,
		tags: ["health"],
	},
	CS: {
		id: "CS",
		name: "Caricanium Solution",
		sellValue: 5,
		unlockBaseCost: 20,
		recipe: {
			GS: 2,
			TB: 1,
		},
		tier: 1,
		tags: ["cleansing"],
	},
	BB: {
		id: "BB",
		name: "Boarder's Breath",
		sellValue: 8,
		unlockBaseCost: 20,
		recipe: {
			TB: 1,
			GS: 1,
			ST: 3,
		},
		tier: 2,
		tags: ["energy"],
	},
	FA: {
		id: "FA",
		name: "Fool's Anaesthetic",
		sellValue: 3,
		unlockBaseCost: 20,
		recipe: {
			GS: 1,
			ST: 1,
		},
		tier: 1,
		tags: ["cleansing"],
	},
	AA: {
		id: "AA",
		name: "Al-Asah's Antidote",
		recipe: {
			TB: 1,
			BR: 1,
			RK: 1,
			GS: 1,
		},
		sellValue: 6,
		unlockBaseCost: 20,
		tier: 2,
		tags: ["cleansing"],
	},
	BE: {
		id: "BE",
		name: "Believer's Burning Brew",
		recipe: {
			BR: 1,
			RK: 1,
		},
		sellValue: 3,
		unlockBaseCost: 20,
		tier: 1,
		tags: ["cleansing"],
	},
	WB: {
		id: "WB",
		name: "Warbrew",
		recipe: {
			TB: 2,
			RK: 1,
		},
		sellValue: 5,
		unlockBaseCost: 20,
		tier: 1,
		tags: ["energy"],
	},
	GM: {
		id: "GM",
		name: "Guardians Memory",
		recipe: {
			TB: 2,
			GS: 1,
			ST: 2,
		},
		sellValue: 8,
		unlockBaseCost: 20,
		tier: 2,
		tags: ["health"],
	},
	LB: {
		id: "LB",
		name: "Leechbane",
		recipe: {
			TB: 2,
			BR: 1,
			RK: 2,
		},
		sellValue: 8,
		unlockBaseCost: 20,
		tier: 2,
		tags: ["health"],
	},
	KS: {
		id: "KS",
		name: "Kaida's Summer Special",
		recipe: {
			RK: 2,
			GS: 2,
		},
		sellValue: 6,
		unlockBaseCost: 20,
		tier: 1,
		tags: ["health"],
	},
	MB: {
		id: "MB",
		name: "Mageblood",
		recipe: {
			TB: 1,
			RK: 1,
		},
		sellValue: 3,
		unlockBaseCost: 20,
		tier: 1,
		tags: ["mana"],
	},
	AS: {
		id: "AS",
		name: "Arcmages Spirit",
		recipe: {
			TB: 2,
			BR: 2,
			GS: 2,
			ST: 4,
		},
		sellValue: 15,
		unlockBaseCost: 20,
		tier: 2,
		tags: ["mana"],
	},
	BQ: {
		id: "BQ",
		// name: "Blessed Water of the Questing Knight",
		name: "Questing Knight",
		recipe: {
			TB: 4,
			RK: 2,
			GS: 4,
			ST: 2,
		},
		sellValue: 18,
		unlockBaseCost: 20,
		tier: 2,
		tags: ["energy"],
	},
	// CH: {
	// 	id: "CH",
	// 	name: "Charr",
	// 	recipe: {
	// 		TB: 1,
	// 		GS: 1,
	// 		BS: 1,
	// 	},
	// 	sellValue: 5,
	// 	unlockBaseCost: 20,
	// 	tier: 2,
	// },
	CB: {
		id: "CB",
		name: "Concoction of Bright Morning",
		recipe: {
			TB: 2,
			RK: 2,
			GS: 4,
		},
		sellValue: 12,
		unlockBaseCost: 20,
		tier: 2,
		tags: ["divine"],
	},
	CN: {
		id: "CN",
		name: "Concoction of the Cold Night",
		recipe: {
			BR: 2,
			RK: 2,
			ST: 4,
		},
		sellValue: 12,
		unlockBaseCost: 20,
		tier: 2,
		tags: ["divine"],
	},
	CA: {
		id: "CA",
		name: "Conquerors Ale",
		recipe: {
			TB: 3,
			RK: 2,
			GS: 2,
			ST: 1,
		},
		sellValue: 12,
		unlockBaseCost: 20,
		tier: 2,
		tags: ["energy"],
	},
	FS: {
		id: "FS",
		name: "Fade of the Spheres",
		recipe: {
			TB: 4,
			BR: 2,
			RK: 2,
			GS: 2,
			ST: 2,
		},
		sellValue: 18,
		unlockBaseCost: 20,
		tier: 3,
		tags: ["cleansing", "health"],
	},
	RS: {
		id: "RS",
		name: "Rhythm of the Spheres",
		recipe: {
			TB: 2,
			BR: 1,
			RK: 1,
			GS: 4,
			ST: 2,
		},
		sellValue: 15,
		unlockBaseCost: 20,
		tier: 3,
		tags: ["divine", "weird"],
	},
	SF: {
		id: "SF",
		name: "Soulfire",
		recipe: {
			TB: 3,
			RK: 4,
			GS: 4,
			ST: 3,
		},
		sellValue: 21,
		unlockBaseCost: 20,
		tier: 2,
		tags: ["divine"],
	},
	SB: {
		id: "SB",
		name: "Starblood",
		recipe: {
			TB: 2,
			BR: 4,
			RK: 1,
			GS: 1,
			ST: 2,
		},
		sellValue: 15,
		unlockBaseCost: 20,
		tier: 3,
		tags: ["divine", "weird"],
	},
	SS: {
		id: "SS",
		name: "Stormseeker",
		recipe: {
			BR: 3,
			RK: 2,
		},
		sellValue: 8,
		unlockBaseCost: 20,
		tier: 1,
		tags: ["weird"],
	},
	TA: {
		id: "TA",
		name: "Times Absence",
		recipe: {
			TB: 3,
			BR: 4,
			RK: 3,
			ST: 4,
		},
		sellValue: 21,
		unlockBaseCost: 20,
		tier: 2,
		tags: ["divine"],
	},
	VD: {
		id: "VD",
		name: "Van Demuers Solace",
		recipe: {
			TB: 2,
			BR: 2,
			RK: 3,
			GS: 1,
		},
		sellValue: 12,
		unlockBaseCost: 20,
		tier: 2,
		tags: ["mana"],
	},
};

export const POTION_NAME_TO_ID: Record<string, PotionId> = {
	"Elixir Vitae": "EV",
	"Caricanium Solution": "CS",
	"Boarder's Breath": "BB",
	"Fool's Anaesthetic": "FA",
	"Al-Asah's Antidote": "AA",
	"Believer's Burning Brew": "BE",
	Warbrew: "WB",
	"Guardians Memory": "GM",
	Leechbane: "LB",
	"Kaida's Summer Special": "KS",
	Mageblood: "MB",
	"Arcmages Spirit": "AS",
	"Blessed Water of the Questing Knight": "BQ",
	// Charr: "CH",
	"Concoction of Bright Morning": "CB",
	"Concoction of the Cold Night": "CN",
	"Conquerors Ale": "CA",
	"Fade of the Spheres": "FS",
	"Rhythm of the Spheres": "RS",
	Soulfire: "SF",
	Starblood: "SB",
	Stormseeker: "SS",
	"Times Absence": "TA",
	"Van Demuers Solace": "VD",
};

export function getPotionName(potionId: PotionId): string {
	return POTIONS[potionId].name;
}

export function getPotionId(name: string): PotionId | undefined {
	return POTION_NAME_TO_ID[name];
}
