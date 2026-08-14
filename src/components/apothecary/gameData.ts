// ********************************************************** Herbs

export const HERB_IDS = ["GS", "TB", "ST"] as const;
export type HerbId = (typeof HERB_IDS)[number];

export interface HerbDefinition {
	id: HerbId;
	name: string;
	emoji: string;
}

export interface PotionDefinition {
	id: PotionId;
	name: string;
	sellValue: number;
	recipe: Partial<Record<HerbId, number>>;
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
	// beggars root: 🫜
	// rakoric: 🪻
	// blacksap: 🫐
};

export const HERB_NAME_TO_ID: Record<string, HerbId> = {
	"Green Sunleaf": "GS",
	"Throne's Boon": "TB",
	"Stone Stem": "ST",
};

export function getHerbName(herbId: HerbId): string {
	return HERBS[herbId].name;
}

export function getHerbId(name: string): HerbId | undefined {
	return HERB_NAME_TO_ID[name];
}


// ********************************************************** Potions

export const POTION_IDS = ["EV", "CS", "BB", "FA"] as const;
export type PotionId = (typeof POTION_IDS)[number];

export const POTIONS: Record<PotionId, PotionDefinition> = {
	EV: {
		id: "EV",
		name: "Elixir Vitae",
		sellValue: 1,
		recipe: {
			GS: 1,
			TB: 1,
		},
	},
	CS: {
		id: "CS",
		name: "Caricanium Solution",
		sellValue: 2,
		recipe: {
			GS: 2,
			TB: 1,
		},
	},
    BB: {
        id: "BB",
        name: "Boarder's Breath",
        sellValue: 2,
        recipe: {
            TB: 1,
            GS: 1,
            ST: 3,
        },
    },
	FA: {
		id: "FA",
		name: "Fool's Anaesthetic",
        sellValue: 1,
        recipe: {
            GS: 1,
            ST: 1,
        }
	},
};

export const POTION_NAME_TO_ID: Record<string, PotionId> = {
	"Elixir Vitae": "EV",
	"Caricanium Solution": "CS",
	"Boarder's Breath": "BB",
	"Fool's Anaesthetic": "FA",
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
		baseCost: 12,
		costScale: 1.15,
	},
	apothecaries: {
		id: "apothecaries",
		name: "Apothecaries",
		singularName: "Apothecary",
		emoji: "🧪",
		baseCost: 20,
		costScale: 1.15,
	},
	merchants: {
		id: "merchants",
		name: "Merchants",
		singularName: "Merchant",
		emoji: "💸",
		baseCost: 16,
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
