import {
	createBooleanRecord,
	createCountRecord,
	HERB_IDS,
	POTIONS,
	POTION_IDS,
	WORKER_IDS,
	type HerbId,
	type PotionId,
	type Tag,
	type WorkerId,
} from "../components/data/gameData";
import {
	UPGRADE_IDS,
	type UpgradeId,
} from "../components/data/upgrades";
export const GAME_AUTOSAVE_INTERVAL_MS = 3000;
export const GAME_SAVE_KEY = "apothecary.save.v1";
const GAME_SAVE_VERSION = 1;

interface PersistedMarketTrend {
	tag?: Tag;
	herbIds?: HerbId[];
}

interface PersistedGameStateV1 {
	herbs: Record<HerbId, number>;
	unlockedHerbs: Record<HerbId, boolean>;
	potions: Record<PotionId, number>;
	potionDemand: Record<PotionId, number>;
	activeTrend: PersistedMarketTrend | null;
	trendRemainingMs: number;
	unlockedPotions: Record<PotionId, boolean>;
	money: number;
	workers: Record<WorkerId, number>;
	farmerAssignments: Record<HerbId, number>;
	apothecaryPreferences: PotionId[];
	purchasedUpgrades: Record<UpgradeId, boolean>;
}

interface PersistedGameSave {
	version: 1;
	updatedAt: string;
	state: PersistedGameStateV1;
}

interface GameStateForPersistence extends PersistedGameStateV1 {}

function sanitizeNumber(value: unknown): number {
	if (typeof value !== "number" || !Number.isFinite(value)) {
		return 0;
	}
	return Math.max(0, Math.floor(value));
}

function sanitizeHerbCounts(value: unknown): Record<HerbId, number> {
	const normalized = createCountRecord(HERB_IDS);
	if (!value || typeof value !== "object") {
		return normalized;
	}

	for (const herbId of HERB_IDS) {
		normalized[herbId] = sanitizeNumber((value as Partial<Record<HerbId, unknown>>)[herbId]);
	}

	return normalized;
}

function sanitizePotionCounts(value: unknown): Record<PotionId, number> {
	const normalized = createCountRecord(POTION_IDS);
	if (!value || typeof value !== "object") {
		return normalized;
	}

	for (const potionId of POTION_IDS) {
		normalized[potionId] = sanitizeNumber(
			(value as Partial<Record<PotionId, unknown>>)[potionId],
		);
	}

	return normalized;
}

function sanitizePotionDemand(value: unknown): Record<PotionId, number> {
	const normalized = POTION_IDS.reduce(
		(record, potionId) => {
			record[potionId] = 1;
			return record;
		},
		{} as Record<PotionId, number>,
	);
	if (!value || typeof value !== "object") {
		return normalized;
	}

	for (const potionId of POTION_IDS) {
		const demand = (value as Partial<Record<PotionId, unknown>>)[potionId];
		if (typeof demand === "number" && Number.isFinite(demand)) {
			normalized[potionId] = Math.min(2.5, Math.max(0.5, demand));
		}
	}

	return normalized;
}

function sanitizeMarketTrend(value: unknown): PersistedMarketTrend | null {
	if (!value || typeof value !== "object") {
		return null;
	}

	const trend = value as {
		type?: unknown;
		tag?: unknown;
		herbIds?: unknown;
	};
	const validTags = new Set<Tag>(POTION_IDS.flatMap((potionId) => POTIONS[potionId].tags));
	const tag =
		typeof trend.tag === "string" && validTags.has(trend.tag as Tag)
			? (trend.tag as Tag)
			: undefined;
	const herbIds = Array.isArray(trend.herbIds)
		? trend.herbIds.filter(
			(herbId): herbId is HerbId =>
				typeof herbId === "string" && HERB_IDS.includes(herbId as HerbId),
		)
		: [];

	if (!tag && herbIds.length === 0) {
		return null;
	}

	return {
		...(tag ? { tag } : {}),
		...(herbIds.length > 0 ? { herbIds } : {}),
	};
}

function sanitizeWorkerCounts(value: unknown): Record<WorkerId, number> {
	const normalized = createCountRecord(WORKER_IDS);
	if (!value || typeof value !== "object") {
		return normalized;
	}

	for (const workerId of WORKER_IDS) {
		normalized[workerId] = sanitizeNumber(
			(value as Partial<Record<WorkerId, unknown>>)[workerId],
		);
	}

	return normalized;
}

function sanitizeUnlockedHerbs(
	value: unknown,
	initialUnlockedHerbs: Record<HerbId, boolean>,
): Record<HerbId, boolean> {
	const normalized = { ...initialUnlockedHerbs };
	if (!value || typeof value !== "object") {
		return normalized;
	}

	for (const herbId of HERB_IDS) {
		normalized[herbId] = Boolean((value as Partial<Record<HerbId, unknown>>)[herbId]);
	}

	return normalized;
}

function sanitizeUnlockedPotions(
	value: unknown,
	initialUnlockedPotions: Record<PotionId, boolean>,
): Record<PotionId, boolean> {
	const normalized = { ...initialUnlockedPotions };
	if (!value || typeof value !== "object") {
		return normalized;
	}

	for (const potionId of POTION_IDS) {
		normalized[potionId] = Boolean((value as Partial<Record<PotionId, unknown>>)[potionId]);
	}

	return normalized;
}

function sanitizePurchasedUpgrades(value: unknown): Record<UpgradeId, boolean> {
	const normalized = createBooleanRecord(UPGRADE_IDS);
	if (!value || typeof value !== "object") {
		return normalized;
	}

	for (const upgradeId of UPGRADE_IDS) {
		normalized[upgradeId] = Boolean((value as Partial<Record<UpgradeId, unknown>>)[upgradeId]);
	}

	return normalized;
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

function sanitizePotionOrder(
	value: unknown,
	unlockedPotions: Record<PotionId, boolean>,
	defaultPotionOrder: PotionId[],
): PotionId[] {
	if (!Array.isArray(value)) {
		return normalizePotionOrder(defaultPotionOrder, unlockedPotions);
	}

	const requestedOrder = value.filter((item): item is PotionId =>
		typeof item === "string" ? POTION_IDS.includes(item as PotionId) : false,
	);

	const normalized = normalizePotionOrder(requestedOrder, unlockedPotions);
	if (normalized.length > 0) {
		return normalized;
	}

	return normalizePotionOrder(defaultPotionOrder, unlockedPotions);
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

function buildPersistedState(state: GameStateForPersistence): PersistedGameStateV1 {
	return {
		herbs: state.herbs,
		unlockedHerbs: state.unlockedHerbs,
		potions: state.potions,
		potionDemand: state.potionDemand,
		activeTrend: state.activeTrend,
		trendRemainingMs: Math.min(60_000, sanitizeNumber(state.trendRemainingMs)),
		unlockedPotions: state.unlockedPotions,
		money: sanitizeNumber(state.money),
		workers: state.workers,
		farmerAssignments: state.farmerAssignments,
		apothecaryPreferences: state.apothecaryPreferences,
		purchasedUpgrades: state.purchasedUpgrades,
	};
}

interface HydrationOptions {
	initialUnlockedHerbs: Record<HerbId, boolean>;
	initialUnlockedPotions: Record<PotionId, boolean>;
	defaultPotionOrder: PotionId[];
}

export function hydrateGameStateFromStorage<T extends GameStateForPersistence>(
	createInitialGameState: () => T,
	options: HydrationOptions,
): T {
	const fallback = createInitialGameState();

	if (typeof window === "undefined") {
		return fallback;
	}

	try {
		const raw = window.localStorage.getItem(GAME_SAVE_KEY);
		if (!raw) {
			return fallback;
		}

		const parsed = JSON.parse(raw) as Partial<PersistedGameSave>;
		if (parsed.version !== GAME_SAVE_VERSION || !parsed.state) {
			return fallback;
		}

		const unlockedHerbs = sanitizeUnlockedHerbs(
			parsed.state.unlockedHerbs,
			options.initialUnlockedHerbs,
		);
		const unlockedPotions = sanitizeUnlockedPotions(
			parsed.state.unlockedPotions,
			options.initialUnlockedPotions,
		);
		const workers = sanitizeWorkerCounts(parsed.state.workers);
		const farmerAssignments = normalizeFarmerAssignments(
			sanitizeHerbCounts(parsed.state.farmerAssignments),
			unlockedHerbs,
			workers.farmers,
		);

		return {
			...fallback,
			herbs: sanitizeHerbCounts(parsed.state.herbs),
			unlockedHerbs,
			potions: sanitizePotionCounts(parsed.state.potions),
			potionDemand: sanitizePotionDemand(parsed.state.potionDemand),
			activeTrend: sanitizeMarketTrend(parsed.state.activeTrend),
			trendRemainingMs: Math.min(
				60_000,
				sanitizeNumber(parsed.state.trendRemainingMs),
			),
			unlockedPotions,
			money: sanitizeNumber(parsed.state.money),
			workers,
			farmerAssignments,
			apothecaryPreferences: sanitizePotionOrder(
				parsed.state.apothecaryPreferences,
				unlockedPotions,
				options.defaultPotionOrder,
			),
			purchasedUpgrades: sanitizePurchasedUpgrades(parsed.state.purchasedUpgrades),
		};
	} catch {
		return fallback;
	}
}

export function saveGameState(state: GameStateForPersistence): void {
	if (typeof window === "undefined") {
		return;
	}

	const payload: PersistedGameSave = {
		version: GAME_SAVE_VERSION,
		updatedAt: new Date().toISOString(),
		state: buildPersistedState(state),
	};

	window.localStorage.setItem(GAME_SAVE_KEY, JSON.stringify(payload));
}

export function clearSavedGame(): void {
	if (typeof window === "undefined") {
		return;
	}

	window.localStorage.removeItem(GAME_SAVE_KEY);
}
