import { createContext, useEffect, useReducer, useRef } from "react";
import type { ReactNode } from "react";
import {
	BUILDING_IDS,
	UPGRADES,
	UPGRADE_IDS,
	type BuildingId,
	type UpgradeEffect,
	type UpgradeId,
	AggregatedUpgradeEffects,
} from "../components/data/upgrades";
import {
	createBooleanRecord,
	createCountRecord,
	getWorkerHireTotalCost,
	HERB_IDS,
	POTIONS,
	POTION_IDS,
	WORKER_IDS,
	type HerbId,
	type PotionId,
	type Tag,
	type WorkerId,
	HERB_BASE_UNLOCK_COST,
} from "../components/data/gameData";
import {
	clearSavedGame,
	GAME_AUTOSAVE_INTERVAL_MS,
	hydrateGameStateFromStorage,
	saveGameState,
} from "../helpers/saveGame";

const GAME_CLOCK_INTERVAL_MS = 100;

export interface MarketTrend {
	tag?: Tag;
	herbIds?: HerbId[];
}

interface GameContextInterface {
	herbs: Record<HerbId, number>;
	unlockedHerbs: Record<HerbId, boolean>;
	potions: Record<PotionId, number>;
	potionDemand: Record<PotionId, number>;
	minPotionDemand: number;
	maxPotionDemand: number;
	activeTrend: MarketTrend | null;
	trendRemainingMs: number;
	unlockedPotions: Record<PotionId, boolean>;
	purchasedUpgrades: Record<UpgradeId, boolean>;
	money: number;
	workers: Record<WorkerId, number>;
	farmerAssignments: Record<HerbId, number>;
	apothecaryPreferences: PotionId[];
	getHerbUnlockCost: () => number;
	canUnlockHerb: () => boolean;
	getPotionUnlockCost: (potionId: PotionId) => number;
	canUnlockPotionTier: (tier: number) => boolean;
	canUnlockPotion: (potionId: PotionId) => boolean;
	canCraftPotion: (potionId: PotionId) => boolean;
	canSellPotion: (potionId: PotionId) => boolean;
	getPotionDemand: (potionId: PotionId) => number;
	isPotionTrending: (potionId: PotionId) => boolean;
	getPotionTrendMultiplier: (potionId: PotionId) => number;
	getEffectivePotionSellValue: (potionId: PotionId) => number;
	getEffectivePotionDemand: (potionId: PotionId) => number;
	canHireWorker: (workerId: WorkerId) => boolean;
	getBuildingUpgrades: (buildingId: BuildingId) => UpgradeId[];
	isUpgradePurchased: (upgradeId: UpgradeId) => boolean;
	canPurchaseUpgrade: (upgradeId: UpgradeId) => boolean;
	upgradePrerequisitesMet: (upgradeId: UpgradeId) => boolean;
	purchaseUpgrade: (upgradeId: UpgradeId) => void;
	unlockHerb: (herbId: HerbId) => void;
	unlockPotion: (potionId: PotionId) => void;
	gatherHerb: (herbId: HerbId, amount?: number) => void;
	consumeHerb: (herbId: HerbId, amount?: number) => void;
	hireWorker: (workerId: WorkerId, amount?: number) => void;
	setFarmerHerbAssignment: (herbId: HerbId, assignedCount: number) => void;
	setApothecaryPotionOrder: (order: PotionId[]) => void;
	setPotionPriority: (potionId: PotionId, priority?: number) => void;
	craftPotion: (potionId: PotionId, amount?: number) => void;
	sellPotion: (potionId: PotionId, amount?: number) => void;
	tickAdvance: (dtMs: number) => void;
	deltaEvents: GameDeltaEvent[];
	acknowledgeDeltaEvents: (lastEventId: number) => void;
	resetGame: () => void;
}

export type AnimationAnchorId = `herb:${HerbId}` | `craft:${PotionId}` | `sell:${PotionId}`;

export type GameDeltaEvent =
	| {
			id: number;
			type: "herbGain";
			herbId: HerbId;
			anchorId: `herb:${HerbId}`;
			amount: number;
			magnitude: number;
			source: "manual" | "passive";
	  }
	| {
			id: number;
			type: "potionCraft";
			potionId: PotionId;
			anchorId: `craft:${PotionId}`;
			amount: number;
			magnitude: number;
			source: "manual" | "passive";
	  }
	| {
			id: number;
			type: "potionSell";
			potionId: PotionId;
			anchorId: `sell:${PotionId}`;
			amount: number;
			magnitude: number;
			source: "manual" | "passive";
	  };

type GameDeltaEventInput =
	| Omit<Extract<GameDeltaEvent, { type: "herbGain" }>, "id">
	| Omit<Extract<GameDeltaEvent, { type: "potionCraft" }>, "id">
	| Omit<Extract<GameDeltaEvent, { type: "potionSell" }>, "id">;

interface GameState {
	herbs: Record<HerbId, number>;
	unlockedHerbs: Record<HerbId, boolean>;
	potions: Record<PotionId, number>;
	potionDemand: Record<PotionId, number>;
	activeTrend: MarketTrend | null;
	trendRemainingMs: number;
	unlockedPotions: Record<PotionId, boolean>;
	purchasedUpgrades: Record<UpgradeId, boolean>;
	money: number;
	workers: Record<WorkerId, number>;
	farmerAssignments: Record<HerbId, number>;
	apothecaryPreferences: PotionId[];
	accumulators: {
		herbProduction: Record<HerbId, number>;
		craftAttempts: number;
		sellAttempts: number;
	};
	deltaEvents: GameDeltaEvent[];
	nextDeltaEventId: number;
}

type GameAction =
	| {
			type: "GATHER_HERB";
			herbId: HerbId;
			amount: number;
	  }
	| {
			type: "CONSUME_HERB";
			herbId: HerbId;
			amount: number;
	  }
	| {
			type: "HIRE_WORKER";
			workerId: WorkerId;
			amount: number;
	  }
	| {
			type: "UNLOCK_HERB";
			herbId: HerbId;
	  }
	| {
			type: "UNLOCK_POTION";
			potionId: PotionId;
	  }
	| {
			type: "PURCHASE_UPGRADE";
			upgradeId: UpgradeId;
	  }
	| {
			type: "SET_FARMER_HERB_ASSIGNMENT";
			herbId: HerbId;
			assignedCount: number;
	  }
	| {
			type: "SET_APOTHECARY_POTION_ORDER";
			order: PotionId[];
	  }
	| {
			type: "CRAFT_POTION";
			potionId: PotionId;
			amount: number;
	  }
	| {
			type: "SELL_POTION";
			potionId: PotionId;
			amount: number;
	  }
	| {
			type: "TICK_ADVANCE";
			dtMs: number;
	  }
	| {
			type: "ACKNOWLEDGE_DELTA_EVENTS";
			lastEventId: number;
	  }
	| {
			type: "RESET_GAME";
	  }
	| {
			type: "HYDRATE_GAME_STATE";
			state: GameState;
	  };

const FARMER_ACTIONS_PER_SECOND = 0.5;
const APOTHECARY_CRAFT_ATTEMPTS_PER_SECOND = 0.3;
const MERCHANT_SELL_ATTEMPTS_PER_SECOND = 0.3;
const HERB_UNLOCK_COST_SCALE = 2.2;
const POTION_UNLOCK_COST_SCALE = 1.25;
const DEMAND_UPGRADE_ID: UpgradeId = "market.demand_based_pricing";
const DEFAULT_POTION_DEMAND = 1;
const MIN_POTION_DEMAND = 0.5;
const MAX_POTION_DEMAND = 1.5;
const DEMAND_LOSS_PER_POTION = 0.025;
const DEMAND_RECOVERY_PER_SECOND = 0.015;
const TAG_TREND_UPGRADE_ID: UpgradeId = "market.trends_tags";
const INGREDIENT_TREND_UPGRADE_ID: UpgradeId = "market.trends_ingredients";
const TREND_DURATION_MS = 30_000;
const TREND_SELL_VALUE_MULTIPLIER = 1.5;
const COMBINED_TREND_SELL_VALUE_MULTIPLIER = 2;

export const INITIAL_UNLOCKED_HERBS: HerbId[] = ["GS", "TB"];
export const INITIAL_UNLOCKED_HERBS_RECORD = HERB_IDS.reduce(
	(record, herbId) => {
		record[herbId] = INITIAL_UNLOCKED_HERBS.includes(herbId);
		return record;
	},
	{} as Record<HerbId, boolean>,
);

export const INITIAL_UNLOCKED_POTIONS: PotionId[] = ["EV"];
export const INITIAL_UNLOCKED_POTIONS_RECORD = POTION_IDS.reduce(
	(record, potionId) => {
		record[potionId] = INITIAL_UNLOCKED_POTIONS.includes(potionId);
		return record;
	},
	{} as Record<PotionId, boolean>,
);

const STARTING_UNLOCKED_HERB_COUNT = HERB_IDS.filter((herbId) =>
	INITIAL_UNLOCKED_HERBS.includes(herbId),
).length;

const STARTING_UNLOCKED_POTION_COUNT = POTION_IDS.filter((potionId) =>
	INITIAL_UNLOCKED_POTIONS.includes(potionId),
).length;

const UPGRADES_BY_BUILDING: Record<BuildingId, UpgradeId[]> = BUILDING_IDS.reduce(
	(record, buildingId) => {
		record[buildingId] = UPGRADE_IDS.filter(
			(upgradeId) => UPGRADES[upgradeId].buildingId === buildingId,
		);
		return record;
	},
	{} as Record<BuildingId, UpgradeId[]>,
);

function addDeltaEvent(
	events: GameDeltaEvent[],
	nextEventId: number,
	event: GameDeltaEventInput,
): number {
	events.push({ id: nextEventId, ...event });
	return nextEventId + 1;
}

function normalizePotionOrder(
	order: PotionId[],
	unlockedPotions: Record<PotionId, boolean>,
): PotionId[] {
	const seen = new Set<PotionId>();
	const normalized: PotionId[] = [];

	for (const potionId of order) {
		if (seen.has(potionId) || !POTION_IDS.includes(potionId)) {
			continue;
		}
		seen.add(potionId);
		normalized.push(potionId);
	}

	return normalized.filter((potionId) => unlockedPotions[potionId]);
}

function normalizeFarmerAssignments(
	assignments: Record<HerbId, number>,
	unlockedHerbs: Record<HerbId, boolean>,
	totalFarmers: number,
): Record<HerbId, number> {
	const normalized = { ...assignments };
	for (const herbId of HERB_IDS) {
		if (!unlockedHerbs[herbId]) {
			normalized[herbId] = 0;
			continue;
		}
		normalized[herbId] = Math.max(0, Math.floor(normalized[herbId]));
	}

	const assignedTotal = HERB_IDS.reduce((sum, herbId) => sum + normalized[herbId], 0);

	if (assignedTotal > totalFarmers) {
		let overflow = assignedTotal - totalFarmers;
		for (const herbId of HERB_IDS) {
			if (overflow === 0) {
				break;
			}
			const reducible = Math.min(normalized[herbId], overflow);
			normalized[herbId] -= reducible;
			overflow -= reducible;
		}
	}

	return normalized;
}

function getCraftableCount(
	herbs: Record<HerbId, number>,
	potionId: PotionId,
	requestedAmount: number,
): number {
	let craftableCount = requestedAmount;
	const recipe = POTIONS[potionId].recipe;

	for (const herbId of HERB_IDS) {
		const herbCost = recipe[herbId] ?? 0;
		if (herbCost === 0) {
			continue;
		}
		craftableCount = Math.min(craftableCount, Math.floor(herbs[herbId] / herbCost));
	}

	return craftableCount;
}

/**
 * Selects a craftable potion based on weighted preferences.
 * Returns null if no craftable potion is available.
 */
function selectWeightedCraftablePotion(
	herbs: Record<HerbId, number>,
	preferences: PotionId[],
	unlockedPotions: Record<PotionId, boolean>,
): PotionId | null {
	const craftablePotions = preferences.filter(
		(potionId) => unlockedPotions[potionId] && getCraftableCount(herbs, potionId, 1) > 0,
	);

	// Need to weight higher-preference potions even more heavily.
	const weights = craftablePotions.map((_, index) => 0.6 ** (index + 1));

	const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);

	if (totalWeight === 0) {
		return null;
	}

	let selection = Math.random() * totalWeight;
	for (let index = 0; index < craftablePotions.length; index++) {
		selection -= weights[index];
		if (selection < 0) {
			return craftablePotions[index];
		}
	}

	return craftablePotions[craftablePotions.length - 1];
}

function getUnlockedHerbCount(unlockedHerbs: Record<HerbId, boolean>): number {
	return HERB_IDS.filter((herbId) => unlockedHerbs[herbId]).length;
}

function getHerbUnlockCostForState(unlockedHerbs: Record<HerbId, boolean>): number {
	if (getUnlockedHerbCount(unlockedHerbs) === HERB_IDS.length) {
		return 0;
	}

	const unlockTier = Math.max(
		0,
		getUnlockedHerbCount(unlockedHerbs) - STARTING_UNLOCKED_HERB_COUNT,
	);
	return Math.ceil(HERB_BASE_UNLOCK_COST * HERB_UNLOCK_COST_SCALE ** unlockTier);
}

function getUnlockedPotionCount(unlockedPotions: Record<PotionId, boolean>): number {
	return POTION_IDS.filter((potionId) => unlockedPotions[potionId]).length;
}

function getPotionUnlockCostForState(
	unlockedPotions: Record<PotionId, boolean>,
	potionId: PotionId,
): number {
	if (unlockedPotions[potionId]) {
		return 0;
	}

	const unlockTier = Math.max(
		0,
		getUnlockedPotionCount(unlockedPotions) - STARTING_UNLOCKED_POTION_COUNT,
	);

	return Math.ceil(POTIONS[potionId].unlockBaseCost * POTION_UNLOCK_COST_SCALE ** unlockTier);
}

function getRequiredRecipeUpgradeForTier(tier: number): UpgradeId | null {
	if (tier <= 1) {
		return null;
	}

	if (tier === 2) {
		return "laboratory.advanced_recipes_1";
	}

	if (tier === 3) {
		return "laboratory.advanced_recipes_2";
	}

	return null;
}

function canUnlockPotionTierForState(
	purchasedUpgrades: Record<UpgradeId, boolean>,
	tier: number,
): boolean {
	const requiredUpgradeId = getRequiredRecipeUpgradeForTier(tier);
	if (!requiredUpgradeId) {
		return true;
	}

	return purchasedUpgrades[requiredUpgradeId];
}

function getUpgradeEffects(
	purchasedUpgrades: Record<UpgradeId, boolean>,
): AggregatedUpgradeEffects {
	const aggregated: AggregatedUpgradeEffects = {
		farmerRateMultiplier: 1,
		apothecaryRateMultiplier: 1,
		merchantRateMultiplier: 1,
		potionSellValueMultiplier: 1,
		manualHerbGatherMultiplier: 1,
		manualPotionCraftMultiplier: 1,
		manualPotionSellMultiplier: 1,
		workerRateMultiplier: 1,
		apothecaryExtraPotionChance: 0,
		potionDemandMaxIncrease: 0,
		potionDemandRecoveryMultiplier: 1,
		potionDemandLossMultiplier: 1,
	};

	for (const upgradeId of UPGRADE_IDS) {
		if (!purchasedUpgrades[upgradeId]) {
			continue;
		}

		const effect: UpgradeEffect = UPGRADES[upgradeId].effects;
		aggregated.farmerRateMultiplier *= effect.farmerRateMultiplier ?? 1;
		aggregated.apothecaryRateMultiplier *= effect.apothecaryRateMultiplier ?? 1;
		aggregated.merchantRateMultiplier *= effect.merchantRateMultiplier ?? 1;
		aggregated.potionSellValueMultiplier *= effect.potionSellValueMultiplier ?? 1;
		aggregated.manualHerbGatherMultiplier *= effect.manualHerbGatherMultiplier ?? 1;
		aggregated.manualPotionCraftMultiplier *= effect.manualPotionCraftMultiplier ?? 1;
		aggregated.manualPotionSellMultiplier *= effect.manualPotionSellMultiplier ?? 1;
		aggregated.workerRateMultiplier *= effect.workerRateMultiplier ?? 1;
		aggregated.apothecaryExtraPotionChance += effect.apothecaryExtraPotionChance ?? 0;
		aggregated.potionDemandMaxIncrease += effect.potionDemandMaxIncrease ?? 0;
		aggregated.potionDemandRecoveryMultiplier *= effect.potionDemandRecoveryMultiplier ?? 1;
		aggregated.potionDemandLossMultiplier *= effect.potionDemandLossMultiplier ?? 1;
	}

	return aggregated;
}

function areUpgradePrerequisitesMet(
	purchasedUpgrades: Record<UpgradeId, boolean>,
	upgradeId: UpgradeId,
): boolean {
	for (const prerequisiteId of UPGRADES[upgradeId].prerequisites) {
		if (!purchasedUpgrades[prerequisiteId]) {
			return false;
		}
	}

	return true;
}

function canPurchaseUpgradeForState(state: GameState, upgradeId: UpgradeId): boolean {
	if (state.purchasedUpgrades[upgradeId]) {
		return false;
	}

	if (!areUpgradePrerequisitesMet(state.purchasedUpgrades, upgradeId)) {
		return false;
	}

	return state.money >= UPGRADES[upgradeId].cost;
}

// Generate all possible market trend candidates based on potion tags and ingredient combinations.
// Run this once to generate all possible trend candidates
function getTrendCandidates(): MarketTrend[] {
	const tags = Array.from(new Set(POTION_IDS.flatMap((potionId) => POTIONS[potionId].tags)));
	const candidates: MarketTrend[] = tags.map((tag) => ({ tag }));
	const ingredientKeys = new Set<string>();
	const combinedKeys = new Set<string>();

	for (const potionId of POTION_IDS) {
		const herbIds = HERB_IDS.filter((herbId) => (POTIONS[potionId].recipe[herbId] ?? 0) > 0);
		for (let firstIndex = 0; firstIndex < herbIds.length; firstIndex++) {
			for (let secondIndex = firstIndex + 1; secondIndex < herbIds.length; secondIndex++) {
				const ingredientKey = `${herbIds[firstIndex]},${herbIds[secondIndex]}`;
				ingredientKeys.add(ingredientKey);
				for (const tag of POTIONS[potionId].tags) {
					combinedKeys.add(`${tag}|${ingredientKey}`);
				}
			}
		}
	}
	for (const key of ingredientKeys) {
		candidates.push({ herbIds: key.split(",") as HerbId[] });
	}
	for (const key of combinedKeys) {
		const [tag, ingredientKey] = key.split("|");
		candidates.push({
			tag: tag as Tag,
			herbIds: ingredientKey.split(",") as HerbId[],
		});
	}

	return candidates;
}

const ALL_TREND_CANDIDATES = getTrendCandidates();

function createRandomTrend(
	state: GameState,
	previousTrend: MarketTrend | null = null,
): MarketTrend | null {
	if (!state.purchasedUpgrades[TAG_TREND_UPGRADE_ID]) {
		return null;
	}

	// Roll to see if the trend will be just ingredients (25%), just tags (25%), or both (50%)!
	// The player's unlocked upgrades will determine which types of trends can appear.
	const ingredientTrendsUnlocked = state.purchasedUpgrades[INGREDIENT_TREND_UPGRADE_ID];
	const tagTrendsUnlocked = state.purchasedUpgrades[TAG_TREND_UPGRADE_ID];

	let candidates = ALL_TREND_CANDIDATES;
	if (ingredientTrendsUnlocked && tagTrendsUnlocked) {
		// Both types of trends are unlocked
		const roll = Math.random();
		if (roll < 0.25) {
			// Just ingredients
			candidates = candidates.filter((candidate) => !candidate.tag);
		} else if (roll < 0.5) {
			// Just tags
			candidates = candidates.filter((candidate) => !candidate.herbIds);
		} else {
			// Both ingredients and tags
			candidates = candidates.filter((candidate) => candidate.herbIds && candidate.tag);
		}
	} else if (ingredientTrendsUnlocked) {
		// Only ingredient trends are unlocked
		candidates = candidates.filter((candidate) => candidate.herbIds && !candidate.tag);
	} else if (tagTrendsUnlocked) {
		// Only tag trends are unlocked
		candidates = candidates.filter((candidate) => candidate.tag && !candidate.herbIds);
	} else {
		// No trends are unlocked
		return null;
	}

	if (candidates.length === 0) {
		return null;
	}
	const previousKey = previousTrend ? JSON.stringify(previousTrend) : null;
	const newCandidates = candidates.filter(
		(candidate) => JSON.stringify(candidate) !== previousKey,
	);
	const availableCandidates = newCandidates.length > 0 ? newCandidates : candidates;
	return availableCandidates[Math.floor(Math.random() * availableCandidates.length)];
}

function doesPotionMatchTrend(potionId: PotionId, trend: MarketTrend | null): boolean {
	if (!trend) {
		return false;
	}
	const matchesTag = !trend.tag || POTIONS[potionId].tags.includes(trend.tag);
	const matchesIngredients =
		!trend.herbIds ||
		trend.herbIds.every((herbId) => (POTIONS[potionId].recipe[herbId] ?? 0) > 0);
	return matchesTag && matchesIngredients;
}

function getTrendSellValueMultiplier(trend: MarketTrend | null): number {
	if (!trend) {
		return 1;
	}
	return trend.tag && trend.herbIds
		? COMBINED_TREND_SELL_VALUE_MULTIPLIER
		: TREND_SELL_VALUE_MULTIPLIER;
}

function getEffectivePotionDemandState(
	potionId: PotionId,
	purchasedUpgrades: Record<UpgradeId, boolean>,
	potionDemand: Record<PotionId, number>,
	activeTrend: MarketTrend | null,
): number {
	const demandBaseMultiplier = purchasedUpgrades[DEMAND_UPGRADE_ID]
		? potionDemand[potionId]
		: DEFAULT_POTION_DEMAND;
	const trendMultiplier = doesPotionMatchTrend(potionId, activeTrend)
		? getTrendSellValueMultiplier(activeTrend)
		: 1;
	return demandBaseMultiplier * trendMultiplier;
}

function getEffectivePotionSellValueState(
	potionId: PotionId,
	purchasedUpgrades: Record<UpgradeId, boolean>,
	potionDemand: Record<PotionId, number>,
	activeTrend: MarketTrend | null,
): number {
	const effects = getUpgradeEffects(purchasedUpgrades);
	const effectiveDemandMultiplier = getEffectivePotionDemandState(
		potionId,
		purchasedUpgrades,
		potionDemand,
		activeTrend,
	);
	return Math.max(
		1,
		Math.ceil(
			POTIONS[potionId].sellValue *
				effects.potionSellValueMultiplier *
				effectiveDemandMultiplier,
		),
	);
}

function createPotionDemandRecord(): Record<PotionId, number> {
	return POTION_IDS.reduce(
		(record, potionId) => {
			record[potionId] = DEFAULT_POTION_DEMAND;
			return record;
		},
		{} as Record<PotionId, number>,
	);
}

function createInitialGameState(): GameState {
	return {
		herbs: createCountRecord(HERB_IDS),
		unlockedHerbs: { ...INITIAL_UNLOCKED_HERBS_RECORD },
		potions: createCountRecord(POTION_IDS),
		potionDemand: createPotionDemandRecord(),
		activeTrend: null,
		trendRemainingMs: 0,
		unlockedPotions: { ...INITIAL_UNLOCKED_POTIONS_RECORD },
		purchasedUpgrades: createBooleanRecord(UPGRADE_IDS),
		money: process.env.NEXT_PUBLIC_HERB_JUMPSTART === "true" ? 100000000 : 0,
		workers: createCountRecord(WORKER_IDS),
		farmerAssignments: createCountRecord(HERB_IDS),
		apothecaryPreferences: ["EV", "CS"],
		accumulators: {
			herbProduction: createCountRecord(HERB_IDS),
			craftAttempts: 0,
			sellAttempts: 0,
		},
		deltaEvents: [],
		nextDeltaEventId: 1,
	};
}

const initialGameState = createInitialGameState();

function gameReducer(state: GameState, action: GameAction): GameState {
	switch (action.type) {
		case "GATHER_HERB": {
			const effects = getUpgradeEffects(state.purchasedUpgrades);
			const gainedAmount = Math.max(
				0,
				Math.floor(action.amount) * effects.manualHerbGatherMultiplier,
			);
			if (gainedAmount === 0 || !state.unlockedHerbs[action.herbId]) {
				return state;
			}

			const deltaEvents = [...state.deltaEvents];
			const nextDeltaEventId = addDeltaEvent(deltaEvents, state.nextDeltaEventId, {
				type: "herbGain",
				herbId: action.herbId,
				anchorId: `herb:${action.herbId}`,
				amount: 1,
				magnitude: gainedAmount,
				source: "manual",
			});

			return {
				...state,
				herbs: {
					...state.herbs,
					[action.herbId]: state.herbs[action.herbId] + gainedAmount,
				},
				deltaEvents,
				nextDeltaEventId,
			};
		}
		case "CONSUME_HERB": {
			return {
				...state,
				herbs: {
					...state.herbs,
					[action.herbId]: Math.max(state.herbs[action.herbId] - action.amount, 0),
				},
			};
		}
		case "HIRE_WORKER": {
			const requestedAmount = Math.max(0, Math.floor(action.amount));
			if (requestedAmount === 0) {
				return state;
			}

			const currentlyOwned = state.workers[action.workerId];
			let affordableAmount = 0;
			let totalCost = 0;

			for (let i = 1; i <= requestedAmount; i++) {
				const costForNextBatch = getWorkerHireTotalCost(action.workerId, currentlyOwned, i);
				if (costForNextBatch > state.money) {
					break;
				}
				affordableAmount = i;
				totalCost = costForNextBatch;
			}

			if (affordableAmount === 0) {
				return state;
			}

			const nextWorkers = {
				...state.workers,
				[action.workerId]: state.workers[action.workerId] + affordableAmount,
			};

			const nextFarmerAssignments =
				action.workerId === "farmers"
					? normalizeFarmerAssignments(
							{
								...state.farmerAssignments,
								GS: state.farmerAssignments.GS + affordableAmount,
							},
							state.unlockedHerbs,
							nextWorkers.farmers,
						)
					: state.farmerAssignments;

			return {
				...state,
				money: state.money - totalCost,
				workers: nextWorkers,
				farmerAssignments: nextFarmerAssignments,
			};
		}
		case "UNLOCK_HERB": {
			if (state.unlockedHerbs[action.herbId]) {
				return state;
			}

			const unlockCost = getHerbUnlockCostForState(state.unlockedHerbs);
			if (state.money < unlockCost) {
				return state;
			}

			return {
				...state,
				money: state.money - unlockCost,
				unlockedHerbs: {
					...state.unlockedHerbs,
					[action.herbId]: true,
				},
			};
		}
		case "UNLOCK_POTION": {
			if (state.unlockedPotions[action.potionId]) {
				return state;
			}

			const potionTier = POTIONS[action.potionId].tier;
			if (!canUnlockPotionTierForState(state.purchasedUpgrades, potionTier)) {
				return state;
			}

			const unlockCost = getPotionUnlockCostForState(state.unlockedPotions, action.potionId);
			if (state.money < unlockCost) {
				return state;
			}

			const unlockedPotions = {
				...state.unlockedPotions,
				[action.potionId]: true,
			};

			return {
				...state,
				money: state.money - unlockCost,
				unlockedPotions,
				apothecaryPreferences: normalizePotionOrder(
					[...state.apothecaryPreferences, action.potionId],
					unlockedPotions,
				),
			};
		}
		case "PURCHASE_UPGRADE": {
			if (!canPurchaseUpgradeForState(state, action.upgradeId)) {
				return state;
			}

			const purchasedUpgrades = {
				...state.purchasedUpgrades,
				[action.upgradeId]: true,
			};
			const nextState = {
				...state,
				money: state.money - UPGRADES[action.upgradeId].cost,
				purchasedUpgrades,
			};
			return action.upgradeId === TAG_TREND_UPGRADE_ID
				? {
						...nextState,
						activeTrend: createRandomTrend(nextState),
						trendRemainingMs: TREND_DURATION_MS,
					}
				: nextState;
		}
		case "SET_FARMER_HERB_ASSIGNMENT": {
			const nextAssignments = normalizeFarmerAssignments(
				{
					...state.farmerAssignments,
					[action.herbId]: Math.max(0, Math.floor(action.assignedCount)),
				},
				state.unlockedHerbs,
				state.workers.farmers,
			);

			return {
				...state,
				farmerAssignments: nextAssignments,
			};
		}
		case "SET_APOTHECARY_POTION_ORDER": {
			return {
				...state,
				apothecaryPreferences: normalizePotionOrder(action.order, state.unlockedPotions),
			};
		}
		case "CRAFT_POTION": {
			const effects = getUpgradeEffects(state.purchasedUpgrades);
			const requestedAmount = Math.max(
				0,
				Math.floor(action.amount) * effects.manualPotionCraftMultiplier,
			);
			if (requestedAmount === 0 || !state.unlockedPotions[action.potionId]) {
				return state;
			}

			const craftableCount = getCraftableCount(state.herbs, action.potionId, requestedAmount);
			if (craftableCount === 0) {
				return state;
			}

			const recipe = POTIONS[action.potionId].recipe;
			const nextHerbs = { ...state.herbs };
			for (const herbId of HERB_IDS) {
				const herbCost = recipe[herbId] ?? 0;
				nextHerbs[herbId] -= herbCost * craftableCount;
			}

			return {
				...state,
				herbs: nextHerbs,
				potions: {
					...state.potions,
					[action.potionId]: state.potions[action.potionId] + craftableCount,
				},
				deltaEvents: [
					...state.deltaEvents,
					{
						id: state.nextDeltaEventId,
						type: "potionCraft",
						potionId: action.potionId,
						anchorId: `craft:${action.potionId}`,
						amount: 1,
						magnitude: craftableCount,
						source: "manual",
					},
				],
				nextDeltaEventId: state.nextDeltaEventId + 1,
			};
		}
		case "SELL_POTION": {
			const effects = getUpgradeEffects(state.purchasedUpgrades);
			const requestedAmount = Math.max(
				0,
				Math.floor(action.amount) * effects.manualPotionSellMultiplier,
			);
			if (requestedAmount === 0 || !state.unlockedPotions[action.potionId]) {
				return state;
			}

			const sellCount = Math.min(requestedAmount, state.potions[action.potionId]);
			if (sellCount === 0) {
				return state;
			}

			const sellValue = getEffectivePotionSellValueState(
				action.potionId,
				state.purchasedUpgrades,
				state.potionDemand,
				state.activeTrend,
			);
			const potionDemand = state.purchasedUpgrades[DEMAND_UPGRADE_ID]
				? {
						...state.potionDemand,
						[action.potionId]: Math.max(
							MIN_POTION_DEMAND,
							state.potionDemand[action.potionId] -
								sellCount *
									DEMAND_LOSS_PER_POTION *
									effects.potionDemandLossMultiplier,
						),
					}
				: state.potionDemand;

			return {
				...state,
				potions: {
					...state.potions,
					[action.potionId]: state.potions[action.potionId] - sellCount,
				},
				potionDemand,
				money: state.money + sellCount * sellValue,
				deltaEvents: [
					...state.deltaEvents,
					{
						id: state.nextDeltaEventId,
						type: "potionSell",
						potionId: action.potionId,
						anchorId: `sell:${action.potionId}`,
						amount: 1,
						magnitude: sellCount,
						source: "manual",
					},
				],
				nextDeltaEventId: state.nextDeltaEventId + 1,
			};
		}
		case "TICK_ADVANCE": {
			const dtMs = Math.max(0, action.dtMs);
			if (dtMs === 0) {
				return state;
			}

			const dtSeconds = dtMs / 1000;
			const effects = getUpgradeEffects(state.purchasedUpgrades);
			let activeTrend = state.activeTrend;
			let trendRemainingMs = state.trendRemainingMs;
			if (state.purchasedUpgrades[TAG_TREND_UPGRADE_ID]) {
				trendRemainingMs -= dtMs;
				if (!activeTrend || trendRemainingMs <= 0) {
					activeTrend = createRandomTrend(state, activeTrend);
					trendRemainingMs = TREND_DURATION_MS;
				}
			}
			const nextHerbs = { ...state.herbs };
			const nextPotions = { ...state.potions };
			const nextPotionDemand = { ...state.potionDemand };
			const demandEnabled = state.purchasedUpgrades[DEMAND_UPGRADE_ID];
			const maxPotionDemand = MAX_POTION_DEMAND + effects.potionDemandMaxIncrease;
			if (demandEnabled) {
				for (const potionId of POTION_IDS) {
					nextPotionDemand[potionId] = Math.min(
						maxPotionDemand,
						nextPotionDemand[potionId] +
							DEMAND_RECOVERY_PER_SECOND *
								effects.potionDemandRecoveryMultiplier *
								dtSeconds,
					);
				}
			}
			const nextHerbProductionAcc = { ...state.accumulators.herbProduction };
			let nextMoney = state.money;
			const deltaEvents = [...state.deltaEvents];
			let nextDeltaEventId = state.nextDeltaEventId;
			const craftedByPotion = createCountRecord(POTION_IDS);
			const doubleCraftedByPotion = createCountRecord(POTION_IDS);
			const soldByPotion = createCountRecord(POTION_IDS);

			for (const herbId of HERB_IDS) {
				if (!state.unlockedHerbs[herbId]) {
					nextHerbProductionAcc[herbId] = 0;
					continue;
				}

				const assignedFarmers = state.farmerAssignments[herbId];
				const herbRatePerSecond =
					assignedFarmers *
					FARMER_ACTIONS_PER_SECOND *
					effects.farmerRateMultiplier *
					effects.workerRateMultiplier;
				nextHerbProductionAcc[herbId] += herbRatePerSecond * dtSeconds;
				const harvestedAmount = Math.floor(nextHerbProductionAcc[herbId]);
				if (harvestedAmount > 0) {
					nextHerbs[herbId] += harvestedAmount;
					nextHerbProductionAcc[herbId] -= harvestedAmount;
					nextDeltaEventId = addDeltaEvent(deltaEvents, nextDeltaEventId, {
						type: "herbGain",
						herbId,
						anchorId: `herb:${herbId}`,
						amount: harvestedAmount,
						magnitude: 1,
						source: "passive",
					});
				}
			}

			let nextCraftAttemptsAcc =
				state.accumulators.craftAttempts +
				state.workers.apothecaries *
					APOTHECARY_CRAFT_ATTEMPTS_PER_SECOND *
					effects.apothecaryRateMultiplier *
					effects.workerRateMultiplier *
					dtSeconds;
			const wholeCraftAttempts = Math.floor(nextCraftAttemptsAcc);
			nextCraftAttemptsAcc -= wholeCraftAttempts;

			for (let i = 0; i < wholeCraftAttempts; i++) {
				const potionId = selectWeightedCraftablePotion(
					nextHerbs,
					state.apothecaryPreferences,
					state.unlockedPotions,
				);
				if (!potionId) {
					break;
				}

				const recipe = POTIONS[potionId].recipe;
				for (const herbId of HERB_IDS) {
					const herbCost = recipe[herbId] ?? 0;
					if (herbCost === 0) {
						continue;
					}
					nextHerbs[herbId] -= herbCost;
				}

				const doubleCraftChance = effects.apothecaryExtraPotionChance;
				if (Math.random() < doubleCraftChance) {
					nextPotions[potionId] += 2;
					doubleCraftedByPotion[potionId] += 1;
				} else {
					nextPotions[potionId] += 1;
					craftedByPotion[potionId] += 1;
				}
			}

			let nextSellAttemptsAcc =
				state.accumulators.sellAttempts +
				state.workers.merchants *
					MERCHANT_SELL_ATTEMPTS_PER_SECOND *
					effects.merchantRateMultiplier *
					effects.workerRateMultiplier *
					dtSeconds;
			const wholeSellAttempts = Math.floor(nextSellAttemptsAcc);
			nextSellAttemptsAcc -= wholeSellAttempts;

			for (let i = 0; i < wholeSellAttempts; i++) {
				let sold = false;
				const potionsByPrice = [...POTION_IDS].sort((a, b) => {
					return state.purchasedUpgrades["market.demand_selling"]
						? getEffectivePotionDemandState(
								b,
								state.purchasedUpgrades,
								nextPotionDemand,
								activeTrend,
							) -
								getEffectivePotionDemandState(
									a,
									state.purchasedUpgrades,
									nextPotionDemand,
									activeTrend,
								)
						: getEffectivePotionSellValueState(
								b,
								state.purchasedUpgrades,
								nextPotionDemand,
								activeTrend,
							) -
								getEffectivePotionSellValueState(
									a,
									state.purchasedUpgrades,
									nextPotionDemand,
									activeTrend,
								);
				});
				for (const potionId of potionsByPrice) {
					if (!state.unlockedPotions[potionId]) {
						continue;
					}

					if (nextPotions[potionId] <= 0) {
						continue;
					}

					nextPotions[potionId] -= 1;
					nextMoney += getEffectivePotionSellValueState(
						potionId,
						state.purchasedUpgrades,
						nextPotionDemand,
						activeTrend,
					);
					if (demandEnabled) {
						nextPotionDemand[potionId] = Math.max(
							MIN_POTION_DEMAND,
							nextPotionDemand[potionId] -
								DEMAND_LOSS_PER_POTION * effects.potionDemandLossMultiplier,
						);
					}
					soldByPotion[potionId] += 1;
					sold = true;
					break;
				}

				if (!sold) {
					break;
				}
			}

			for (const potionId of POTION_IDS) {
				if (craftedByPotion[potionId] > 0) {
					nextDeltaEventId = addDeltaEvent(deltaEvents, nextDeltaEventId, {
						type: "potionCraft",
						potionId,
						anchorId: `craft:${potionId}`,
						amount: craftedByPotion[potionId],
						magnitude: 1,
						source: "passive",
					});
				}
				if (doubleCraftedByPotion[potionId] > 0) {
					nextDeltaEventId = addDeltaEvent(deltaEvents, nextDeltaEventId, {
						type: "potionCraft",
						potionId,
						anchorId: `craft:${potionId}`,
						amount: doubleCraftedByPotion[potionId],
						magnitude: 2,
						source: "passive",
					});
				}
				if (soldByPotion[potionId] > 0) {
					nextDeltaEventId = addDeltaEvent(deltaEvents, nextDeltaEventId, {
						type: "potionSell",
						potionId,
						anchorId: `sell:${potionId}`,
						amount: soldByPotion[potionId],
						magnitude: 1,
						source: "passive",
					});
				}
			}

			return {
				...state,
				herbs: nextHerbs,
				potions: nextPotions,
				potionDemand: nextPotionDemand,
				activeTrend,
				trendRemainingMs,
				money: nextMoney,
				deltaEvents,
				nextDeltaEventId,
				accumulators: {
					herbProduction: nextHerbProductionAcc,
					craftAttempts: nextCraftAttemptsAcc,
					sellAttempts: nextSellAttemptsAcc,
				},
			};
		}
		case "ACKNOWLEDGE_DELTA_EVENTS": {
			if (state.deltaEvents.length === 0) {
				return state;
			}

			return {
				...state,
				deltaEvents: state.deltaEvents.filter((event) => event.id > action.lastEventId),
			};
		}
		case "RESET_GAME": {
			return createInitialGameState();
		}
		case "HYDRATE_GAME_STATE": {
			return action.state;
		}
		default:
			return state;
	}
}

export const GameContext = createContext<GameContextInterface>({
	herbs: initialGameState.herbs,
	unlockedHerbs: initialGameState.unlockedHerbs,
	potions: initialGameState.potions,
	potionDemand: initialGameState.potionDemand,
	minPotionDemand: MIN_POTION_DEMAND,
	maxPotionDemand: MAX_POTION_DEMAND,
	activeTrend: null,
	trendRemainingMs: 0,
	unlockedPotions: initialGameState.unlockedPotions,
	purchasedUpgrades: initialGameState.purchasedUpgrades,
	money: initialGameState.money,
	workers: initialGameState.workers,
	farmerAssignments: initialGameState.farmerAssignments,
	apothecaryPreferences: initialGameState.apothecaryPreferences,
	getHerbUnlockCost: () => 0,
	canUnlockHerb: () => false,
	getPotionUnlockCost: () => 0,
	canUnlockPotionTier: () => false,
	canUnlockPotion: () => false,
	canCraftPotion: () => false,
	canSellPotion: () => false,
	canHireWorker: () => false,
	getPotionDemand: () => DEFAULT_POTION_DEMAND,
	isPotionTrending: () => false,
	getPotionTrendMultiplier: () => 0,
	getEffectivePotionSellValue: () => 0,
	getEffectivePotionDemand: () => 0,
	getBuildingUpgrades: () => [],
	isUpgradePurchased: () => false,
	upgradePrerequisitesMet: () => false,
	canPurchaseUpgrade: () => false,
	purchaseUpgrade: () => {},
	unlockHerb: () => {},
	unlockPotion: () => {},
	gatherHerb: () => {},
	consumeHerb: () => {},
	hireWorker: () => {},
	setFarmerHerbAssignment: () => {},
	setApothecaryPotionOrder: () => {},
	setPotionPriority: () => {},
	craftPotion: () => {},
	sellPotion: () => {},
	tickAdvance: () => {},
	deltaEvents: [],
	acknowledgeDeltaEvents: () => {},
	resetGame: () => {},
});

export default function GameContextProvider({ children }: { children: ReactNode }) {
	const [gameState, dispatch] = useReducer(gameReducer, initialGameState);
	const gameStateRef = useRef(gameState);

	function getHerbUnlockCost() {
		return getHerbUnlockCostForState(gameState.unlockedHerbs);
	}

	function canUnlockHerb() {
		if (getUnlockedHerbCount(gameState.unlockedHerbs) === HERB_IDS.length) {
			return false;
		}

		return gameState.money >= getHerbUnlockCost();
	}

	function getPotionUnlockCost(potionId: PotionId) {
		return getPotionUnlockCostForState(gameState.unlockedPotions, potionId);
	}

	function canUnlockPotionTier(tier: number) {
		return canUnlockPotionTierForState(gameState.purchasedUpgrades, tier);
	}

	function canUnlockPotion(potionId: PotionId) {
		if (gameState.unlockedPotions[potionId]) {
			return false;
		}

		if (!canUnlockPotionTier(POTIONS[potionId].tier)) {
			return false;
		}

		return gameState.money >= getPotionUnlockCost(potionId);
	}

	function canCraftPotion(potionId: PotionId) {
		return (
			gameState.unlockedPotions[potionId] &&
			getCraftableCount(gameState.herbs, potionId, 1) > 0
		);
	}

	function canSellPotion(potionId: PotionId) {
		return gameState.unlockedPotions[potionId] && gameState.potions[potionId] > 0;
	}

	function getEffectivePotionSellValue(potionId: PotionId) {
		return getEffectivePotionSellValueState(
			potionId,
			gameState.purchasedUpgrades,
			gameState.potionDemand,
			gameState.activeTrend,
		);
	}

	function getEffectivePotionDemand(potionId: PotionId) {
		return getEffectivePotionDemandState(
			potionId,
			gameState.purchasedUpgrades,
			gameState.potionDemand,
			gameState.activeTrend,
		);
	}

	function getPotionDemand(potionId: PotionId) {
		return gameState.potionDemand[potionId];
	}

	function isPotionTrending(potionId: PotionId) {
		return doesPotionMatchTrend(potionId, gameState.activeTrend);
	}

	function getPotionTrendMultiplier(potionId: PotionId) {
		return isPotionTrending(potionId) ? getTrendSellValueMultiplier(gameState.activeTrend) : 1;
	}

	function getMaxPotionDemand() {
		return (
			MAX_POTION_DEMAND +
			getUpgradeEffects(gameState.purchasedUpgrades).potionDemandMaxIncrease
		);
	}

	function canHireWorker(workerId: WorkerId) {
		return gameState.money >= getWorkerHireTotalCost(workerId, gameState.workers[workerId], 1);
	}

	function getBuildingUpgrades(buildingId: BuildingId) {
		return UPGRADES_BY_BUILDING[buildingId];
	}

	function isUpgradePurchased(upgradeId: UpgradeId) {
		return gameState.purchasedUpgrades[upgradeId];
	}

	function upgradePrerequisitesMet(upgradeId: UpgradeId) {
		return areUpgradePrerequisitesMet(gameState.purchasedUpgrades, upgradeId);
	}

	function canPurchaseUpgrade(upgradeId: UpgradeId) {
		return canPurchaseUpgradeForState(gameState, upgradeId);
	}

	function purchaseUpgrade(upgradeId: UpgradeId) {
		dispatch({ type: "PURCHASE_UPGRADE", upgradeId });
	}

	function gatherHerb(herbId: HerbId, amount = 1) {
		dispatch({ type: "GATHER_HERB", herbId, amount });
	}

	function consumeHerb(herbId: HerbId, amount = 1) {
		dispatch({ type: "CONSUME_HERB", herbId, amount });
	}

	function hireWorker(workerId: WorkerId, amount = 1) {
		dispatch({ type: "HIRE_WORKER", workerId, amount });
	}

	function unlockHerb(herbId: HerbId) {
		dispatch({ type: "UNLOCK_HERB", herbId });
	}

	function unlockPotion(potionId: PotionId) {
		dispatch({ type: "UNLOCK_POTION", potionId });
	}

	function setFarmerHerbAssignment(herbId: HerbId, assignedCount: number) {
		dispatch({ type: "SET_FARMER_HERB_ASSIGNMENT", herbId, assignedCount });
	}

	function setApothecaryPotionOrder(order: PotionId[]) {
		dispatch({ type: "SET_APOTHECARY_POTION_ORDER", order });
	}

	function setPotionPriority(potionId: PotionId, priority?: number) {
		if (priority === undefined) {
			setApothecaryPotionOrder(
				gameState.apothecaryPreferences.filter((id) => id !== potionId),
			);
			return;
		}

		const normalizedPriority = Math.max(0, Math.floor(priority));
		const nextOrder = gameState.apothecaryPreferences.filter((id) => id !== potionId);
		const clampedPriority = Math.min(normalizedPriority, nextOrder.length);
		nextOrder.splice(clampedPriority, 0, potionId);
		setApothecaryPotionOrder(nextOrder);
	}

	function craftPotion(potionId: PotionId, amount = 1) {
		dispatch({ type: "CRAFT_POTION", potionId, amount });
	}

	function sellPotion(potionId: PotionId, amount = 1) {
		dispatch({ type: "SELL_POTION", potionId, amount });
	}

	function tickAdvance(dtMs: number) {
		dispatch({ type: "TICK_ADVANCE", dtMs });
	}

	function acknowledgeDeltaEvents(lastEventId: number) {
		dispatch({ type: "ACKNOWLEDGE_DELTA_EVENTS", lastEventId });
	}

	function resetGame() {
		clearSavedGame();
		dispatch({ type: "RESET_GAME" });
	}

	useEffect(() => {
		const interval = setInterval(() => {
			tickAdvance(GAME_CLOCK_INTERVAL_MS);
		}, GAME_CLOCK_INTERVAL_MS);

		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		dispatch({
			type: "HYDRATE_GAME_STATE",
			state: hydrateGameStateFromStorage(createInitialGameState, {
				initialUnlockedHerbs: INITIAL_UNLOCKED_HERBS_RECORD,
				initialUnlockedPotions: INITIAL_UNLOCKED_POTIONS_RECORD,
				defaultPotionOrder: ["EV", "CS"],
			}),
		});
	}, []);

	useEffect(() => {
		gameStateRef.current = gameState;
	}, [gameState]);

	useEffect(() => {
		const interval = setInterval(() => {
			saveGameState(gameStateRef.current);
		}, GAME_AUTOSAVE_INTERVAL_MS);

		return () => clearInterval(interval);
	}, []);

	const gameContext: GameContextInterface = {
		herbs: gameState.herbs,
		unlockedHerbs: gameState.unlockedHerbs,
		potions: gameState.potions,
		potionDemand: gameState.potionDemand,
		minPotionDemand: MIN_POTION_DEMAND,
		maxPotionDemand: getMaxPotionDemand(),
		activeTrend: gameState.activeTrend,
		trendRemainingMs: gameState.trendRemainingMs,
		unlockedPotions: gameState.unlockedPotions,
		purchasedUpgrades: gameState.purchasedUpgrades,
		money: gameState.money,
		workers: gameState.workers,
		farmerAssignments: gameState.farmerAssignments,
		apothecaryPreferences: gameState.apothecaryPreferences,
		getHerbUnlockCost,
		canUnlockHerb,
		getPotionUnlockCost,
		canUnlockPotionTier,
		canUnlockPotion,
		canCraftPotion,
		canSellPotion,
		canHireWorker,
		getPotionDemand,
		isPotionTrending,
		getPotionTrendMultiplier,
		getEffectivePotionSellValue,
		getEffectivePotionDemand,
		getBuildingUpgrades,
		isUpgradePurchased,
		upgradePrerequisitesMet,
		canPurchaseUpgrade,
		purchaseUpgrade,
		unlockHerb,
		unlockPotion,
		gatherHerb,
		consumeHerb,
		hireWorker,
		setFarmerHerbAssignment,
		setApothecaryPotionOrder,
		setPotionPriority,
		craftPotion,
		sellPotion,
		tickAdvance,
		deltaEvents: gameState.deltaEvents,
		acknowledgeDeltaEvents,
		resetGame,
	};

	return <GameContext.Provider value={gameContext}>{children}</GameContext.Provider>;
}
