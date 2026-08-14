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
