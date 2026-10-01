export const CRYSTAL_MANA_EMOJI = "💎";
export const PRAY_EMOJI = "⏳";

export function createCountRecord<T extends string>(ids: readonly T[]): Record<T, number> {
	const result = {} as Record<T, number>;
	for (const id of ids) {
		result[id] = 0;
	}
	return result;
}

export function createBooleanRecord<T extends string>(
	ids: readonly T[],
	initialValue = false,
): Record<T, boolean> {
	const result = {} as Record<T, boolean>;
	for (const id of ids) {
		result[id] = initialValue;
	}
	return result;
}
