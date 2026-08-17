// ********************************************************** Herbs

export const HERB_IDS = ["GS", "TB", "ST", "BR", "RK", "BS"] as const;
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
	BS: {
		id: "BS",
		name: "Blacksap",
		emoji: "🫐",
	},
};

export const HERB_NAME_TO_ID: Record<string, HerbId> = {
	"Green Sunleaf": "GS",
	"Throne's Boon": "TB",
	"Stone Stem": "ST",
	"Beggars Root": "BR",
	"Rakoric": "RK",
	"Blacksap": "BS",
};

export function getHerbName(herbId: HerbId): string {
	return HERBS[herbId].name;
}

export function getHerbId(name: string): HerbId | undefined {
	return HERB_NAME_TO_ID[name];
}


// ********************************************************** Potions

export const POTION_IDS = ["EV", "CS", "BB", "FA", "AA", "BE", "WB", "GM","LB","KS","MB"] as const;
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
		sellValue: 4,
		unlockBaseCost: 30,
		recipe: {
			GS: 2,
			TB: 1,
		},
		tier: 1,
	},
    BB: {
        id: "BB",
        name: "Boarder's Breath",
        sellValue: 5,
		unlockBaseCost: 40,
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
		unlockBaseCost: 35,
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
		unlockBaseCost: 50,
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
		sellValue: 4,
		unlockBaseCost: 30,
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
		sellValue: 7,
		unlockBaseCost: 60,
		tier: 3,
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
		costScale: 1.125,
	},
	apothecaries: {
		id: "apothecaries",
		name: "Apothecaries",
		singularName: "Apothecary",
		emoji: "🧪",
		baseCost: 26,
		costScale: 1.15,
	},
	merchants: {
		id: "merchants",
		name: "Merchants",
		singularName: "Merchant",
		emoji: "💸",
		baseCost: 24,
		costScale: 1.15,
	},
};

export const WORKER_EMOJIS: Record<WorkerId, string> = {
    farmers: "🪏",
    apothecaries: "🧪",
    merchants: "💸",
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
