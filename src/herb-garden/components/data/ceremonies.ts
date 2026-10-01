import type { UpgradeEffect } from "./upgrades";

export interface CeremonyDefinition {
	id: CeremonyId;
	name: string;
	description: string;
	unlockCost: number;
	manaCost: number;
	// Not yet applied while active - placeholder for future ceremony effect wiring.
	effects: UpgradeEffect;
}

export const CEREMONY_IDS = ["BN", "RW", "CD", "IV", "WF"] as const;
export type CeremonyId = (typeof CEREMONY_IDS)[number];

export const CEREMONIES: Record<CeremonyId, CeremonyDefinition> = {
	BN: {
		id: "BN",
		name: "Blessing of New Spring",
		description: "Business blooms. Potions sell for 20% more.",
		unlockCost: 400,
		manaCost: 4,
		effects: {
			potionSellValueMultiplier: 1.2,
		},
	},
	RW: {
		id: "RW",
		name: "Chamber of the Restful Warrior",
		description: "Farmers rest their muscles. Herbs gathered 25% faster.",
		unlockCost: 1000,
		manaCost: 15,
		effects: {
			farmerRateMultiplier: 1.25,
		},
	},
	CD: {
		id: "CD",
		name: "Chamber of Delights",
		description: "Merchants indulge customers. Potions sold 25% faster.",
		unlockCost: 1000,
		manaCost: 15,
		effects: {
			merchantRateMultiplier: 1.25,
		},
	},
	IV: {
		id: "IV",
		name: "Ward of Ironclad Vigor",
		description: "Apothecaries suffer less toxicity. Potions made 25% faster.",
		unlockCost: 2500,
		manaCost: 25,
		effects: {
			apothecaryRateMultiplier: 1.25,
		},
	},
	WF: {
		id: "WF",
		name: "Wondrous Forests of the Night",
		description: "Growth erupts. Herbs gathered 100% faster.",
		unlockCost: 5000,
		manaCost: 100,
		effects: {
			farmerRateMultiplier: 2,
		},
	},
};
