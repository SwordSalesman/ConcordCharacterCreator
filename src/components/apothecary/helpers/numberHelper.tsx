export function displayNumber(value: number): string {
	if (value >= 1_000_000_000) {
		return (value / 1_000_000_000).toFixed(2) + "B";
	}
	if (value >= 1_000_000) {
		return (value / 1_000_000).toFixed(2) + "M";
	}
	if (value >= 1_000) {
		return `${Math.floor(value / 1000)},${value % 1000}`;
	}

	return value.toString();
}
