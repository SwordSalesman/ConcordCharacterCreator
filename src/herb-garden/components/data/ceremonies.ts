import type { UpgradeEffect } from "./upgrades";

export interface CeremonyDefinition {
	id: CeremonyId;
	name: string;
	description: string;
	unlockCost: number;
	manaCost: number;
	effects: UpgradeEffect;
}

export const CEREMONY_IDS = [
	"BN",
	"CR",
	"RW",
	"CD",
	"IV",
	"MS",
	"RL",
	"TL",
	"WF",
	"SS",
	"GW",
] as const;
export type CeremonyId = (typeof CEREMONY_IDS)[number];

export const CEREMONIES: Record<CeremonyId, CeremonyDefinition> = {
	BN: {
		id: "BN",
		name: "Blessing of New Spring",
		description: "Business blooms. Potion sell price increases 15%.",
		unlockCost: 500,
		manaCost: 4,
		effects: {
			potionSellValueMultiplier: 1.15,
		},
	},
	CR: {
		id: "CR",
		name: "Chorus of the Righteous",
		description: "The bards improve morale. All workers work 15% faster.",
		unlockCost: 500,
		manaCost: 10,
		effects: {
			workerRateMultiplier: 1.15,
		},
	},
	RW: {
		id: "RW",
		name: "Chamber of the Restful Warrior",
		description: "Farmers rest their muscles. Herbs gather 25% faster.",
		unlockCost: 1250,
		manaCost: 15,
		effects: {
			farmerRateMultiplier: 1.25,
		},
	},
	CD: {
		id: "CD",
		name: "Chamber of Delights",
		description: "Merchants indulge customers. Potions sell 25% faster.",
		unlockCost: 1250,
		manaCost: 15,
		effects: {
			merchantRateMultiplier: 1.25,
		},
	},
	IV: {
		id: "IV",
		name: "Ward of Ironclad Vigor",
		description: "Apothecaries suffer less toxicity. Potions brewed 35% faster.",
		unlockCost: 1500,
		manaCost: 25,
		effects: {
			apothecaryRateMultiplier: 1.35,
		},
	},
	MS: {
		id: "MS",
		name: "A Moment to Speak",
		description: "Your merchants dominate the Exchange. Potion sell price increases 40%",
		unlockCost: 2000,
		manaCost: 30,
		effects: {
			potionSellValueMultiplier: 1.4,
		},
	},
	RL: {
		id: "RL",
		name: "Rivers of Life",
		description: "Health and comfort abounds. All workers work 30% faster.",
		unlockCost: 3000,
		manaCost: 50,
		effects: {
			workerRateMultiplier: 1.3,
		},
	},
	TL: {
		id: "TL",
		name: "Trapped in the Labyrinth",
		description: "Travellers can't leave until they buy a potion. Potions sell 125% faster.",
		unlockCost: 5000,
		manaCost: 90,
		effects: {
			merchantRateMultiplier: 2.25,
		},
	},
	WF: {
		id: "WF",
		name: "Wondrous Forests of the Night",
		description: "Herbs grow from everywhere. Herbs gather 125% faster.",
		unlockCost: 5000,
		manaCost: 100,
		effects: {
			farmerRateMultiplier: 2.25,
		},
	},
	SS: {
		id: "SS",
		name: "Soldiers of Storm and Stone",
		description: "They help mix the potions. Potions brewed 125% faster.",
		unlockCost: 5000,
		manaCost: 100,
		effects: {
			apothecaryRateMultiplier: 2.25,
		},
	},
	GW: {
		id: "GW",
		name: "God of War",
		description: "You are an army of productivity. 3x click effectiveness.",
		unlockCost: 5000,
		manaCost: 100,
		effects: {
			manualHerbGatherMultiplier: 3,
			manualPotionCraftMultiplier: 3,
			manualPotionSellMultiplier: 3,
		},
	},
};
