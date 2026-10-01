import { HERBS, HERB_IDS } from "../components/data/herbs";
import { PotionId, POTIONS } from "../components/data/potions";

export function displayNumber(value: number): string {
	if (value < 10_000) {
		return value.toLocaleString("en-US");
	}

	const suffixes = [
		{ threshold: 1_000_000_000_000, suffix: "T" },
		{ threshold: 1_000_000_000, suffix: "B" },
		{ threshold: 1_000_000, suffix: "M" },
		{ threshold: 1_000, suffix: "k" },
	] as const;

	for (const { threshold, suffix } of suffixes) {
		if (value >= threshold) {
			const scaled = value / threshold;
			const integerDigits = Math.floor(scaled).toString().length;
			const decimals = Math.max(0, 4 - integerDigits);

			return `${scaled.toFixed(decimals)}${suffix}`;
		}
	}

	return value.toString();
}

export function potionRecipe(potionId: PotionId): string {
	return Object.entries(POTIONS[potionId].recipe)
		.map(([herbId, amount]) => {
			const emoji = HERBS[herbId as (typeof HERB_IDS)[number]].emoji;
			return amount > 1 ? `${amount}${emoji}` : emoji.repeat(amount);
		})
		.join(" ");
}

export function displayTimer(ms: number): string {
	const totalSeconds = Math.floor(ms / 1000);
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;
	const pad = (value: number) => value.toString().padStart(2, "0");
	return hours > 0 ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${minutes}:${pad(seconds)}`;
}
