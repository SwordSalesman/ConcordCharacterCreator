import { CEREMONY_IDS, type CeremonyId } from "../components/data/ceremonies";
import { createBooleanRecord, createCountRecord } from "../components/data/gameData";
import { HERB_IDS, type HerbId } from "../components/data/herbs";
import { POTIONS, POTION_IDS, type PotionId, type Tag } from "../components/data/potions";
import { WORKER_IDS, type WorkerId } from "../components/data/workers";
import { UPGRADE_IDS, type UpgradeId } from "../components/data/upgrades";

// This file persists herb garden state to the browser's localStorage and reads it back on load.
//
// Storage strategy: the whole game state is serialized as one JSON blob under a single localStorage
// key (GAME_SAVE_KEY). There is no server/database involved - the save only exists on the device/browser
// that created it. `saveGameState` is called periodically (see GAME_AUTOSAVE_INTERVAL_MS) and writes a
// fresh blob each time, overwriting the previous save (not diffed/merged).
//
// Versioning: the saved blob has a `version` number alongside the state. Right now only version 1
// (GAME_SAVE_VERSION) exists. On load, if the stored version doesn't match the current version (or the
// data is missing/corrupt), we don't attempt to migrate it - we just discard it and fall back to a fresh
// default state. If/when the save shape changes in the future, bump GAME_SAVE_VERSION and add a migration
// step here (e.g. a switch on the old version that upgrades the shape to the latest one) instead of
// simply discarding old saves.
//
// Sanitizing vs normalizing (the two kinds of helper functions below):
// - "Sanitize" functions take raw, untrusted `unknown` data (parsed JSON from localStorage, which could be
//   missing fields, wrong types, or left over from an old/edited save) and coerce it into a safe, correctly
//   typed value, falling back to sensible defaults for anything invalid. This protects the app from crashing
//   or behaving strangely if the saved JSON doesn't match what we expect.
// - "Normalize" functions take data that is already correctly typed and enforce the game's internal
//   consistency rules on it - e.g. making sure farmer assignments don't add up to more than the number of
//   farmers the player actually owns, or that the potion crafting order only contains potions that are
//   unlocked and has no duplicates.
// In practice sanitizing often calls normalizing once the raw value has been made type-safe.
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
	elapsedPlayTimeMs: number;
	throneTimeMs: number | null;
	workers: Record<WorkerId, number>;
	farmerAssignments: Record<HerbId, number>;
	apothecaryPreferences: PotionId[];
	purchasedUpgrades: Record<UpgradeId, boolean>;
	crystalMana: number;
	unlockedCeremonies: Record<CeremonyId, boolean>;
	activeCeremonyId: CeremonyId | null;
	activeCeremonyRemainingMs: number;
}

interface PersistedGameSave {
	version: 1;
	updatedAt: string;
	state: PersistedGameStateV1;
}

interface GameStateForPersistence extends PersistedGameStateV1 {}

// Coerces any value into a non-negative whole number, defaulting to 0 if it isn't a usable number.
function sanitizeNumber(value: unknown): number {
	if (typeof value !== "number" || !Number.isFinite(value)) {
		return 0;
	}
	return Math.max(0, Math.floor(value));
}

// Keeps a saved throne time only if it's a valid non-negative number; otherwise treats the game as not yet won.
function sanitizeThroneTimeMs(value: unknown): number | null {
	if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
		return null;
	}
	return Math.floor(value);
}

// Rebuilds a herb-id -> count record from raw save data, defaulting every herb to 0 first.
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

// Rebuilds a potion-id -> count record from raw save data, defaulting every potion to 0 first.
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

// Rebuilds potion demand multipliers, clamping each to the valid 0.5-2.5 range and defaulting to 1.
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

// Validates the saved market trend (a tag and/or affected herb ids), discarding it entirely if neither part is valid.
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

// Rebuilds a worker-id -> count record from raw save data, defaulting every worker type to 0 first.
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

// Rebuilds which herbs are unlocked, starting from the game's default unlocks and overriding with saved values.
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

// Rebuilds which potions are unlocked, starting from the game's default unlocks and overriding with saved values.
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

// Rebuilds which upgrades have been purchased, defaulting every upgrade to not-purchased first.
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

// Rebuilds which ceremonies are unlocked, starting from the game's default unlocks and overriding with saved values.
function sanitizeUnlockedCeremonies(
	value: unknown,
	initialUnlockedCeremonies: Record<CeremonyId, boolean>,
): Record<CeremonyId, boolean> {
	const normalized = { ...initialUnlockedCeremonies };
	if (!value || typeof value !== "object") {
		return normalized;
	}

	for (const ceremonyId of CEREMONY_IDS) {
		normalized[ceremonyId] = Boolean(
			(value as Partial<Record<CeremonyId, unknown>>)[ceremonyId],
		);
	}

	return normalized;
}

// Keeps the saved active ceremony only if it's a real, currently-unlocked ceremony id; otherwise clears it to null.
function sanitizeActiveCeremonyId(
	value: unknown,
	unlockedCeremonies: Record<CeremonyId, boolean>,
): CeremonyId | null {
	if (
		typeof value !== "string" ||
		!CEREMONY_IDS.includes(value as CeremonyId) ||
		!unlockedCeremonies[value as CeremonyId]
	) {
		return null;
	}

	return value as CeremonyId;
}

// Enforces the rules for a potion crafting order: no duplicates, no unknown ids, and only unlocked potions.
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

// Validates the saved potion crafting order; falls back to the default order if the saved one is empty/invalid.
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

// Enforces the rules for farmer assignments: locked herbs get 0 farmers, counts can't be negative/fractional,
// and if more farmers are assigned than the player owns, the excess is trimmed off herb-by-herb.
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

// Picks out just the fields that get saved from the live game state, lightly sanitizing a few of them on the way out.
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
		elapsedPlayTimeMs: sanitizeNumber(state.elapsedPlayTimeMs),
		throneTimeMs: sanitizeThroneTimeMs(state.throneTimeMs),
		workers: state.workers,
		farmerAssignments: state.farmerAssignments,
		apothecaryPreferences: state.apothecaryPreferences,
		purchasedUpgrades: state.purchasedUpgrades,
		crystalMana: sanitizeNumber(state.crystalMana),
		unlockedCeremonies: state.unlockedCeremonies,
		activeCeremonyId: state.activeCeremonyId,
		activeCeremonyRemainingMs: sanitizeNumber(state.activeCeremonyRemainingMs),
	};
}

interface HydrationOptions {
	initialUnlockedHerbs: Record<HerbId, boolean>;
	initialUnlockedPotions: Record<PotionId, boolean>;
	initialUnlockedCeremonies: Record<CeremonyId, boolean>;
	defaultPotionOrder: PotionId[];
}

// Loads the save from localStorage and sanitizes every field, falling back to a fresh default state if there's
// no save, the version doesn't match (see the versioning note at the top of this file), or anything fails to parse.
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
		const unlockedCeremonies = sanitizeUnlockedCeremonies(
			parsed.state.unlockedCeremonies,
			options.initialUnlockedCeremonies,
		);

		return {
			...fallback,
			herbs: sanitizeHerbCounts(parsed.state.herbs),
			unlockedHerbs,
			potions: sanitizePotionCounts(parsed.state.potions),
			potionDemand: sanitizePotionDemand(parsed.state.potionDemand),
			activeTrend: sanitizeMarketTrend(parsed.state.activeTrend),
			trendRemainingMs: Math.min(60_000, sanitizeNumber(parsed.state.trendRemainingMs)),
			unlockedPotions,
			money: sanitizeNumber(parsed.state.money),
			elapsedPlayTimeMs: sanitizeNumber(parsed.state.elapsedPlayTimeMs),
			throneTimeMs: sanitizeThroneTimeMs(parsed.state.throneTimeMs),
			workers,
			farmerAssignments,
			apothecaryPreferences: sanitizePotionOrder(
				parsed.state.apothecaryPreferences,
				unlockedPotions,
				options.defaultPotionOrder,
			),
			purchasedUpgrades: sanitizePurchasedUpgrades(parsed.state.purchasedUpgrades),
			crystalMana: sanitizeNumber(parsed.state.crystalMana),
			unlockedCeremonies,
			activeCeremonyId: sanitizeActiveCeremonyId(
				parsed.state.activeCeremonyId,
				unlockedCeremonies,
			),
			activeCeremonyRemainingMs: sanitizeNumber(parsed.state.activeCeremonyRemainingMs),
		};
	} catch {
		return fallback;
	}
}

// Writes the current game state to localStorage as a single versioned JSON blob, overwriting any previous save.
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

// Deletes the save from localStorage (e.g. for a "reset game" action).
export function clearSavedGame(): void {
	if (typeof window === "undefined") {
		return;
	}

	window.localStorage.removeItem(GAME_SAVE_KEY);
}
