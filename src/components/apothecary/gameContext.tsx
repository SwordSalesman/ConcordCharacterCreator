import { createContext, useEffect, useReducer } from "react";
import type { ReactNode } from "react";
import {
	createCountRecord,
	getWorkerHireTotalCost,
	HERB_IDS,
	POTIONS,
	POTION_IDS,
	WORKER_IDS,
	type HerbId,
	type PotionId,
	type WorkerId,
} from "./gameData";

const GAME_CLOCK_INTERVAL_MS = 200;

interface GameContextInterface {
	herbs: Record<HerbId, number>;
	potions: Record<PotionId, number>;
	money: number;
	workers: Record<WorkerId, number>;
	farmerAssignments: Record<HerbId, number>;
	apothecaryPreferences: PotionId[];
	canCraftPotion: (potionId: PotionId) => boolean;
	canSellPotion: (potionId: PotionId) => boolean;
	canHireWorker: (workerId: WorkerId) => boolean;
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
}

export type AnimationAnchorId = `herb:${HerbId}` | `craft:${PotionId}` | `sell:${PotionId}`;

export type GameDeltaEvent =
	| {
			id: number;
			type: "herbGain";
			herbId: HerbId;
			anchorId: `herb:${HerbId}`;
			amount: number;
			source: "manual" | "passive";
	  }
	| {
			id: number;
			type: "potionCraft";
			potionId: PotionId;
			anchorId: `craft:${PotionId}`;
			amount: number;
			source: "manual" | "passive";
	  }
	| {
			id: number;
			type: "potionSell";
			potionId: PotionId;
			anchorId: `sell:${PotionId}`;
			amount: number;
			source: "manual" | "passive";
	  };

type GameDeltaEventInput =
	| Omit<Extract<GameDeltaEvent, { type: "herbGain" }>, "id">
	| Omit<Extract<GameDeltaEvent, { type: "potionCraft" }>, "id">
	| Omit<Extract<GameDeltaEvent, { type: "potionSell" }>, "id">;

interface GameState {
	herbs: Record<HerbId, number>;
	potions: Record<PotionId, number>;
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
	  };

const FARMER_ACTIONS_PER_SECOND = 0.4;
const APOTHECARY_CRAFT_ATTEMPTS_PER_SECOND = 0.25;
const MERCHANT_SELL_ATTEMPTS_PER_SECOND = 0.3;

function addDeltaEvent(
	events: GameDeltaEvent[],
	nextEventId: number,
	event: GameDeltaEventInput,
): number {
	events.push({ id: nextEventId, ...event });
	return nextEventId + 1;
}

function normalizePotionOrder(order: PotionId[]): PotionId[] {
	const seen = new Set<PotionId>();
	const normalized: PotionId[] = [];

	for (const potionId of order) {
		if (seen.has(potionId) || !POTION_IDS.includes(potionId)) {
			continue;
		}
		seen.add(potionId);
		normalized.push(potionId);
	}

	return normalized;
}

function normalizeFarmerAssignments(
	assignments: Record<HerbId, number>,
	totalFarmers: number,
): Record<HerbId, number> {
	const normalized = { ...assignments };
	for (const herbId of HERB_IDS) {
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

const initialGameState: GameState = {
	herbs: createCountRecord(HERB_IDS),
	potions: createCountRecord(POTION_IDS),
	money: 1234,
	workers: createCountRecord(WORKER_IDS),
	farmerAssignments: createCountRecord(HERB_IDS),
	apothecaryPreferences: [...POTION_IDS],
	accumulators: {
		herbProduction: createCountRecord(HERB_IDS),
		craftAttempts: 0,
		sellAttempts: 0,
	},
	deltaEvents: [],
	nextDeltaEventId: 1,
};

function gameReducer(state: GameState, action: GameAction): GameState {
	switch (action.type) {
		case "GATHER_HERB": {
			const gainedAmount = Math.max(0, Math.floor(action.amount));
			if (gainedAmount === 0) {
				return state;
			}

			const deltaEvents = [...state.deltaEvents];
			const nextDeltaEventId = addDeltaEvent(deltaEvents, state.nextDeltaEventId, {
				type: "herbGain",
				herbId: action.herbId,
				anchorId: `herb:${action.herbId}`,
				amount: gainedAmount,
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
		case "SET_FARMER_HERB_ASSIGNMENT": {
			const nextAssignments = normalizeFarmerAssignments(
				{
					...state.farmerAssignments,
					[action.herbId]: Math.max(0, Math.floor(action.assignedCount)),
				},
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
				apothecaryPreferences: normalizePotionOrder(action.order),
			};
		}
		case "CRAFT_POTION": {
			const requestedAmount = Math.max(0, Math.floor(action.amount));
			if (requestedAmount === 0) {
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
						amount: craftableCount,
						source: "manual",
					},
				],
				nextDeltaEventId: state.nextDeltaEventId + 1,
			};
		}
		case "SELL_POTION": {
			const requestedAmount = Math.max(0, Math.floor(action.amount));
			if (requestedAmount === 0) {
				return state;
			}

			const sellCount = Math.min(requestedAmount, state.potions[action.potionId]);
			if (sellCount === 0) {
				return state;
			}

			return {
				...state,
				potions: {
					...state.potions,
					[action.potionId]: state.potions[action.potionId] - sellCount,
				},
				money: state.money + sellCount * POTIONS[action.potionId].sellValue,
				deltaEvents: [
					...state.deltaEvents,
					{
						id: state.nextDeltaEventId,
						type: "potionSell",
						potionId: action.potionId,
						anchorId: `sell:${action.potionId}`,
						amount: sellCount,
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
			const nextHerbs = { ...state.herbs };
			const nextPotions = { ...state.potions };
			const nextHerbProductionAcc = { ...state.accumulators.herbProduction };
			let nextMoney = state.money;
			const deltaEvents = [...state.deltaEvents];
			let nextDeltaEventId = state.nextDeltaEventId;
			const craftedByPotion = createCountRecord(POTION_IDS);
			const soldByPotion = createCountRecord(POTION_IDS);

			for (const herbId of HERB_IDS) {
				const assignedFarmers = state.farmerAssignments[herbId];
				const herbRatePerSecond = assignedFarmers * FARMER_ACTIONS_PER_SECOND;
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
						source: "passive",
					});
				}
			}

			let nextCraftAttemptsAcc =
				state.accumulators.craftAttempts +
				state.workers.apothecaries * APOTHECARY_CRAFT_ATTEMPTS_PER_SECOND * dtSeconds;
			const wholeCraftAttempts = Math.floor(nextCraftAttemptsAcc);
			nextCraftAttemptsAcc -= wholeCraftAttempts;

			for (let i = 0; i < wholeCraftAttempts; i++) {
				let crafted = false;
				for (const potionId of state.apothecaryPreferences) {
					if (getCraftableCount(nextHerbs, potionId, 1) === 0) {
						continue;
					}

					const recipe = POTIONS[potionId].recipe;
					for (const herbId of HERB_IDS) {
						const herbCost = recipe[herbId] ?? 0;
						if (herbCost === 0) {
							continue;
						}
						nextHerbs[herbId] -= herbCost;
					}
					nextPotions[potionId] += 1;
					craftedByPotion[potionId] += 1;
					crafted = true;
					break;
				}

				if (!crafted) {
					break;
				}
			}

			let nextSellAttemptsAcc =
				state.accumulators.sellAttempts +
				state.workers.merchants * MERCHANT_SELL_ATTEMPTS_PER_SECOND * dtSeconds;
			const wholeSellAttempts = Math.floor(nextSellAttemptsAcc);
			nextSellAttemptsAcc -= wholeSellAttempts;

			for (let i = 0; i < wholeSellAttempts; i++) {
				let sold = false;
				for (const potionId of POTION_IDS) {
					if (nextPotions[potionId] <= 0) {
						continue;
					}

					nextPotions[potionId] -= 1;
					nextMoney += POTIONS[potionId].sellValue;
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
						source: "passive",
					});
				}
				if (soldByPotion[potionId] > 0) {
					nextDeltaEventId = addDeltaEvent(deltaEvents, nextDeltaEventId, {
						type: "potionSell",
						potionId,
						anchorId: `sell:${potionId}`,
						amount: soldByPotion[potionId],
						source: "passive",
					});
				}
			}

			return {
				...state,
				herbs: nextHerbs,
				potions: nextPotions,
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
		default:
			return state;
	}
}

export const GameContext = createContext<GameContextInterface>({
	herbs: initialGameState.herbs,
	potions: initialGameState.potions,
	money: initialGameState.money,
	workers: initialGameState.workers,
	farmerAssignments: initialGameState.farmerAssignments,
	apothecaryPreferences: initialGameState.apothecaryPreferences,
	canCraftPotion: () => false,
	canSellPotion: () => false,
	canHireWorker: () => false,
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
});

export default function GameContextProvider({ children }: { children: ReactNode }) {
	const [gameState, dispatch] = useReducer(gameReducer, initialGameState);

	function canCraftPotion(potionId: PotionId) {
		return getCraftableCount(gameState.herbs, potionId, 1) > 0;
	}

	function canSellPotion(potionId: PotionId) {
		return gameState.potions[potionId] > 0;
	}

	function canHireWorker(workerId: WorkerId) {
		return gameState.money >= getWorkerHireTotalCost(workerId, gameState.workers[workerId], 1);
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

	useEffect(() => {
		const interval = setInterval(() => {
			tickAdvance(GAME_CLOCK_INTERVAL_MS);
		}, GAME_CLOCK_INTERVAL_MS);

		return () => clearInterval(interval);
	}, []);

	const gameContext: GameContextInterface = {
		herbs: gameState.herbs,
		potions: gameState.potions,
		money: gameState.money,
		workers: gameState.workers,
		farmerAssignments: gameState.farmerAssignments,
		apothecaryPreferences: gameState.apothecaryPreferences,
		canCraftPotion,
		canSellPotion,
		canHireWorker,
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
	};

	return <GameContext.Provider value={gameContext}>{children}</GameContext.Provider>;
}
