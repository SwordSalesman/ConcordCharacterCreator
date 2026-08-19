// ********************************************************** Herbs

export const HERB_IDS = ["GS", "TB", "ST", "BR", "RK",
	// "BS"
] as const;
export type HerbId = (typeof HERB_IDS)[number];

export const HERB_BASE_UNLOCK_COST = 20;
export interface HerbDefinition {
	id: HerbId;
	name: string;
	emoji: string;
}

export interface PotionDefinition {
	id: PotionId;
	name: string;
	sellValue: number;
	unlockBaseCost: number;
	recipe: Partial<Record<HerbId, number>>;
	tier: number;
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
	"Rakoric": "RK",
	// "Blacksap": "BS",
};

export function getHerbName(herbId: HerbId): string {
	return HERBS[herbId].name;
}

export function getHerbId(name: string): HerbId | undefined {
	return HERB_NAME_TO_ID[name];
}


// ********************************************************** Potions

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
    },
	FA: {
		id: "FA",
		name: "Fool's Anaesthetic",
        sellValue: 3,
		unlockBaseCost: 25,
        recipe: {
            GS: 1,
            ST: 1,
        },
		tier: 1,
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
	},
};

export const POTION_NAME_TO_ID: Record<string, PotionId> = {
	"Elixir Vitae": "EV",
	"Caricanium Solution": "CS",
	"Boarder's Breath": "BB",
	"Fool's Anaesthetic": "FA",
	"Al-Asah's Antidote": "AA",
	"Believer's Burning Brew": "BE",
	"Warbrew": "WB",
	"Guardians Memory": "GM",
	"Leechbane": "LB",
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

// ********************************************************** Other

export const WORKER_IDS = ["farmers", "apothecaries", "merchants"] as const;
export type WorkerId = (typeof WORKER_IDS)[number];

export interface WorkerDefinition {
	id: WorkerId;
	name: string;
	emoji: string;
	singularName: string;
	baseCost: number;
	costScale: number;
}

export const WORKERS: Record<WorkerId, WorkerDefinition> = {
	farmers: {
		id: "farmers",
		name: "Farmers",
		singularName: "Farmer",
		emoji: "🪏",
		baseCost: 20,
		costScale: 1.175,
	},
	apothecaries: {
		id: "apothecaries",
		name: "Apothecaries",
		singularName: "Apothecary",
		emoji: "🧪",
		baseCost: 35,
		costScale: 1.275,
	},
	merchants: {
		id: "merchants",
		name: "Merchants",
		singularName: "Merchant",
		emoji: "💸",
		baseCost: 32,
		costScale: 1.275,
	},
};

export function getWorkerHireCost(workerId: WorkerId, ownedCount: number): number {
	const worker = WORKERS[workerId];
	return Math.ceil(worker.baseCost * worker.costScale ** ownedCount);
}

export function getWorkerHireTotalCost(
	workerId: WorkerId,
	ownedCount: number,
	purchaseAmount: number,
): number {
	let total = 0;
	for (let i = 0; i < purchaseAmount; i++) {
		total += getWorkerHireCost(workerId, ownedCount + i);
	}
	return total;
}

export function createCountRecord<T extends string>(ids: readonly T[]): Record<T, number> {
	const result = {} as Record<T, number>;
	for (const id of ids) {
		result[id] = 0;
	}
	return result;
}

export function createBooleanRecord<T extends string>(
	ids: readonly T[],
	initialValue = false,
): Record<T, boolean> {
	const result = {} as Record<T, boolean>;
	for (const id of ids) {
		result[id] = initialValue;
	}
	return result;
}
