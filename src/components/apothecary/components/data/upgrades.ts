export const BUILDING_IDS = ["gardens", "laboratory", "market", "tavern"] as const;
export type BuildingId = (typeof BUILDING_IDS)[number];


export interface AggregatedUpgradeEffects {
	farmerRateMultiplier: number;
	apothecaryRateMultiplier: number;
	merchantRateMultiplier: number;
	potionSellValueMultiplier: number;
	manualHerbGatherMultiplier: number;
    manualPotionCraftMultiplier: number;
    manualPotionSellMultiplier: number;
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

const UPGRADE_DEFINITIONS = [
	{
		id: "gardens.quality_tools_1",
		buildingId: "gardens",
		name: "Quality Tools I",
		description: "Each click gathers twice the herbs",
		cost: 20,
		effects: {
			manualHerbGatherMultiplier: 2,
		},
	},
    {
		id: "gardens.quality_tools_2",
		buildingId: "gardens",
		name: "Quality Tools II",
		description: "Each click gathers twice the herbs",
		cost: 20,
		effects: {
			manualHerbGatherMultiplier: 2,
		},
        prerequisites: ["gardens.quality_tools_1"],
	},
	{
		id: "gardens.faster_harvest_1",
		buildingId: "gardens",
		name: "Faster Harvest I",
		description: "Farmers gather herbs 50% faster.",
		cost: 20,
		effects: {
			farmerRateMultiplier: 1.5,
		},
	},
	{
		id: "gardens.faster_harvest_2",
		buildingId: "gardens",
		name: "Faster Harvest II",
		description: "Farmers gather herbs another 50% faster.",
		cost: 20,
		prerequisites: ["gardens.faster_harvest_1"],
		effects: {
			farmerRateMultiplier: 1.50,
		},
	},
    {
		id: "laboratory.quality_tools_1",
		buildingId: "laboratory",
		name: "Quality Tools I",
		description: "Each click brews twice the potions",
		cost: 20,
		effects: {
			manualPotionCraftMultiplier: 2,
		},
	},
    {
        id: "laboratory.quality_tools_2",
		buildingId: "laboratory",
		name: "Quality Tools II",
		description: "Each click brews twice the potions",
		cost: 20,
		effects: {
            manualPotionCraftMultiplier: 2,
		},
        prerequisites: ["laboratory.quality_tools_1"],
	},
	{
		id: "laboratory.better_mortars_1",
		buildingId: "laboratory",
		name: "Better Mortars I",
		description: "Apothecaries attempt crafts 50% faster.",
		cost: 20,
		effects: {
			apothecaryRateMultiplier: 1.5,
		},
	},
	{
		id: "laboratory.better_mortars_2",
		buildingId: "laboratory",
		name: "Better Mortars II",
		description: "Apothecaries attempt crafts another 50% faster.",
		cost: 20,
		prerequisites: ["laboratory.better_mortars_1"],
		effects: {
			apothecaryRateMultiplier: 1.50,
		},
	},
    {
		id: "market.quality_tools_1",
		buildingId: "market",
		name: "Quality Tools I",
		description: "Each click sells twice the potions",
		cost: 20,
		effects: {
			manualPotionSellMultiplier: 2,
		},
	},
    {
		id: "market.quality_tools_2",
		buildingId: "market",
		name: "Quality Tools II",
		description: "Each click sells twice the potions",
		cost: 20,
		effects: {
			manualPotionSellMultiplier: 2,
		},
        prerequisites: ["market.quality_tools_1"],
	},
	{
		id: "market.silver_tongues_1",
		buildingId: "market",
		name: "Silver Tongues I",
		description: "Merchants sell potions 50% faster.",
		cost: 20,
		effects: {
			merchantRateMultiplier: 1.5,
		},
	},
	{
		id: "market.silver_tongues_2",
		buildingId: "market",
		name: "Silver Tongues II",
		description: "Merchants sell potions another 50% faster.",
		cost: 20,
		prerequisites: ["market.silver_tongues_1"],
		effects: {
			merchantRateMultiplier: 1.5,
		},
	},
	{
		id: "tavern.house_special_1",
		buildingId: "tavern",
		name: "House Special I",
		description: "Potion sell value increased by 10%.",
		cost: 20,
		effects: {
			potionSellValueMultiplier: 1.1,
		},
	},
	{
		id: "tavern.house_special_2",
		buildingId: "tavern",
		name: "House Special II",
		description: "Potion sell value increased by another 10%.",
		cost: 20,
		prerequisites: ["tavern.house_special_1"],
		effects: {
			potionSellValueMultiplier: 1.1,
		},
	},
	{
		id: "tavern.commissions_1",
		buildingId: "tavern",
		name: "Private Room",
		description: "Earn the ears of Senators. Unlocks Commissions.",
		cost: 20,
		prerequisites: ["tavern.house_special_1"],
		effects: {
			potionSellValueMultiplier: 1.1,
		},
	},
] as const satisfies readonly UpgradeDefinitionInput[];

export type UpgradeId = (typeof UPGRADE_DEFINITIONS)[number]["id"];

export interface UpgradeDefinition {
	id: UpgradeId;
	buildingId: BuildingId;
	name: string;
	description: string;
	cost: 20;
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
