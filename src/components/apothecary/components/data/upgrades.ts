export const BUILDING_IDS = ["gardens", "laboratory", "market", "tavern"] as const;
export type BuildingId = (typeof BUILDING_IDS)[number];


export interface AggregatedUpgradeEffects {
	farmerRateMultiplier: number;
	apothecaryRateMultiplier: number;
	apothecaryExtraPotionChance: number;
	merchantRateMultiplier: number;
	potionSellValueMultiplier: number;
	manualHerbGatherMultiplier: number;
    manualPotionCraftMultiplier: number;
    manualPotionSellMultiplier: number;
	workerRateMultiplier: number;
}

export interface UpgradeEffect extends Partial<AggregatedUpgradeEffects> {} 
interface UpgradeDefinitionInput {
	id: string;
	buildingId: BuildingId;
	name: string;
	description: string;
	cost: number;
	prerequisites?: string[];
	effects?: UpgradeEffect;
}

/* Ideas

General	
	- see stats for herbs/s / potion/s / keys/s
	- unlock boghoffen hunting (click for money)
Farming
	- x more herbs per click
	- x more effective farmers
	- ability to move farmers in groups of 5
Lab
	- x chance to produce two potions for free
	- x more effective apothecaries
	- learn secret recipes! (narcotics)
	- unlock next 'tier' of recipes (each tier lets you use one additional herb type?)
Market
	- demand drops x slower
	- demand can rise x higher
	- x more effective merchants
	- herb-based demand - cycles through herb types / combinations randomly. potions worth more based on how many of those herb in them.

*/

const UPGRADE_DEFINITIONS = [
	{
		id: "gardens.click_multiplier_1",
		buildingId: "gardens",
		name: "Birch Shovel",
		description: "Each click gathers twice the herbs",
		cost: 80,
		effects: {
			manualHerbGatherMultiplier: 2,
		},
	},
    {
		id: "gardens.click_multiplier_2",
		buildingId: "gardens",
		name: "Hartswood Shovel",
		description: "Each click gathers four times the herbs",
		cost: 500,
		effects: {
			manualHerbGatherMultiplier: 2,
		},
        prerequisites: ["gardens.click_multiplier_1"],
	},
	    {
		id: "gardens.click_multiplier_3",
		buildingId: "gardens",
		name: "Thunderoak Shovel",
		description: "Each click gathers eight times the herbs",
		cost: 3200,
		effects: {
			manualHerbGatherMultiplier: 2,
		},
        prerequisites: ["gardens.click_multiplier_2"],
	},
	{
		id: "gardens.faster_harvest_1",
		buildingId: "gardens",
		name: "Faster Harvest I",
		description: "Farmers gather herbs 50% faster.",
		cost: 75,
		effects: {
			farmerRateMultiplier: 1.5,
		},
	},
	{
		id: "gardens.faster_harvest_2",
		buildingId: "gardens",
		name: "Faster Harvest II",
		description: "Farmers gather herbs another 50% faster.",
		cost: 350,
		prerequisites: ["gardens.faster_harvest_1"],
		effects: {
			farmerRateMultiplier: 1.5,
		},
	},
	{
		id: "gardens.faster_harvest_3",
		buildingId: "gardens",
		name: "Faster Harvest III",
		description: "Farmers gather herbs another 50% faster.",
		cost: 2700,
		prerequisites: ["gardens.faster_harvest_2"],
		effects: {
			farmerRateMultiplier: 1.5,
		},
	},
    {
		id: "laboratory.click_multiplier_1",
		buildingId: "laboratory",
		name: "Stone Mortar",
		description: "Each click brews twice the potions",
		cost: 80,
		effects: {
			manualPotionCraftMultiplier: 2,
		},
	},
    {
        id: "laboratory.click_multiplier_2",
		buildingId: "laboratory",
		name: "Essencite Mortar",
		description: "Each click brews four times the potions",
		cost: 500,
		effects: {
            manualPotionCraftMultiplier: 2,
		},
        prerequisites: ["laboratory.click_multiplier_1"],
	},
	{
        id: "laboratory.click_multiplier_3",
		buildingId: "laboratory",
		name: "Arcstone Mortar",
		description: "Each click brews eight times the potions",
		cost: 3200,
		effects: {
            manualPotionCraftMultiplier: 2,
		},
        prerequisites: ["laboratory.click_multiplier_2"],
	},
	{
		id: "laboratory.dilution_1",
		buildingId: "laboratory",
		name: "Dilution I",
		description: "Apothecaries have a 15% chance to produce an extra potion for free.",
		cost: 75,
		effects: {
			apothecaryExtraPotionChance: 0.15,
		}
	},
	{
		id: "laboratory.dilution_2",
		buildingId: "laboratory",
		name: "Dilution II",
		description: "Apothecaries have a 25% chance to produce an extra potion for free.",
		prerequisites: ["laboratory.dilution_1"],
		cost: 350,
		effects: {
			apothecaryExtraPotionChance: 0.10,
		}
	},
		{
		id: "laboratory.dilution_3",
		buildingId: "laboratory",
		name: "Dilution III",
		description: "Apothecaries have a 35% chance to produce an extra potion for free.",
		prerequisites: ["laboratory.dilution_2"],
		cost: 1700,
		effects: {
			apothecaryExtraPotionChance: 0.10,
		}
	},
	// {
	// 	id: "laboratory.better_mortars_1",
	// 	buildingId: "laboratory",
	// 	name: "Better Mortars I",
	// 	description: "Apothecaries attempt crafts 50% faster.",
	// 	cost: 20,
	// 	effects: {
	// 		apothecaryRateMultiplier: 1.5,
	// 	},

	// },
	// {
	// 	id: "laboratory.better_mortars_2",
	// 	buildingId: "laboratory",
	// 	name: "Better Mortars II",
	// 	description: "Apothecaries attempt crafts another 50% faster.",
	// 	cost: 20,
	// 	prerequisites: ["laboratory.better_mortars_1"],
	// 	effects: {
	// 		apothecaryRateMultiplier: 1.50,
	// 	},
	// },
    {
		id: "market.click_multiplier_1",
		buildingId: "market",
		name: "Iron Scales",
		description: "Each click sells twice the potions",
		cost: 80,
		effects: {
			manualPotionSellMultiplier: 2,
		},
	},
    {
		id: "market.click_multiplier_2",
		buildingId: "market",
		name: "Forgesteel Scales",
		description: "Each click sells four times the potions",
		cost: 350,
		effects: {
			manualPotionSellMultiplier: 2,
		},
        prerequisites: ["market.click_multiplier_1"],
	},
	{
		id: "market.click_multiplier_3",
		buildingId: "market",
		name: "Mithril Scales",
		description: "Each click sells eight times the potions",
		cost: 2700,
		effects: {
			manualPotionSellMultiplier: 2,
		},
        prerequisites: ["market.click_multiplier_2"],
	},
	{
		id: "market.silver_tongues_1",
		buildingId: "market",
		name: "Silver Tongues I",
		description: "Potions sell for 15% more.",
		cost: 75,
		effects: {
			potionSellValueMultiplier: 1.15,
		},
	},
	{
		id: "market.silver_tongues_2",
		buildingId: "market",
		name: "Silver Tongues II",
		description: "Potions sell for another 15% more.",
		cost: 350,
		prerequisites: ["market.silver_tongues_1"],
		effects: {
			potionSellValueMultiplier: 1.15,
		},
	},
	{
		id: "market.silver_tongues_3",
		buildingId: "market",
		name: "Silver Tongues III",
		description: "Potions sell for another 15% more.",
		cost: 3900,
		prerequisites: ["market.silver_tongues_2"],
		effects: {
			potionSellValueMultiplier: 1.15,
		},
	},
	// {
	// 	id: "market.demand_1",
	// 	buildingId: "market",
	// 	name: "Demand Tracking",
	// 	description: "Unlock demand-based potion pricing.",
	// 	cost: 20,
	// 	prerequisites: ["market.silver_tongues_1"],
	// 	effects: {
	// 		// potionSellValueMultiplier: 1.15,
	// 	},
	// },
	{
		id: "tavern.house_special_1",
		buildingId: "tavern",
		name: "House Special I",
		description: "All workers operate 10% faster.",
		cost: 150,
		effects: {
			workerRateMultiplier: 1.1,
		},
	},
	{
		id: "tavern.house_special_2",
		buildingId: "tavern",
		name: "House Special II",
		description: "All workers operate another 10% faster.",
		cost: 1400,
		prerequisites: ["tavern.house_special_1"],
		effects: {
			workerRateMultiplier: 1.1,
		},
	},
	// {
	// 	id: "tavern.commissions_1",
	// 	buildingId: "tavern",
	// 	name: "Private Room",
	// 	description: "Earn the ears of Senators. Unlocks Commissions.",
	// 	cost: 20,
	// 	prerequisites: ["tavern.house_special_1"],
	// 	effects: {
	// 		// potionSellValueMultiplier: 1.1,
	// 	},
	// },
	// {
	// 	id: "tavern.mercenaries_1",
	// 	buildingId: "tavern",
	// 	name: "Hired Muscle",
	// 	description: "Unlock ability to hire Mercenaries for protection.",
	// 	cost: 20,
	// 	prerequisites: ["tavern.house_special_1"],
	// 	effects: {
	// 		// potionSellValueMultiplier: 1.1,
	// 	},
	// },
	// {
	// 	id: "tavern.boghoffen_hunting_1",
	// 	buildingId: "tavern",
	// 	name: "Boghoffen Hunting",
	// 	description: "Click on stray Boghoffens to loot their keys.",
	// 	cost: 20,
	// 	prerequisites: ["tavern.house_special_1"],
	// 	effects: {
	// 		// potionSellValueMultiplier: 1.1,
	// 	},
	// },
] as const satisfies readonly UpgradeDefinitionInput[];

export type UpgradeId = (typeof UPGRADE_DEFINITIONS)[number]["id"];

export interface UpgradeDefinition {
	id: UpgradeId;
	buildingId: BuildingId;
	name: string;
	description: string;
	cost: number;
	prerequisites: UpgradeId[];
	effects: UpgradeEffect;
}

export const UPGRADE_IDS = UPGRADE_DEFINITIONS.map((upgrade) => upgrade.id) as UpgradeId[];

export const UPGRADES: Record<UpgradeId, UpgradeDefinition> = UPGRADE_DEFINITIONS.reduce(
	(record, upgrade) => {
		record[upgrade.id as UpgradeId] = {
			id: upgrade.id as UpgradeId,
			buildingId: upgrade.buildingId,
			name: upgrade.name,
			description: upgrade.description,
			cost: upgrade.cost,
			prerequisites: (
				"prerequisites" in upgrade ? [...upgrade.prerequisites] : []
			) as UpgradeId[],
			effects: ("effects" in upgrade ? upgrade.effects : {}) as UpgradeEffect,
		};
		return record;
	},
	{} as Record<UpgradeId, UpgradeDefinition>,
);
