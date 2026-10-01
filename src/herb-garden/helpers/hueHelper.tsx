import { CSSProperties } from "react";

/**
 * Returns a hue value (0-120 // red-orange-green) based on the relative position of `value` within the range defined by `minValue` and `maxValue`.
 * If the range is zero, it defaults to the midpoint (0.5).
 */
export function getHighLowHue(value: number, minValue: number, maxValue: number) {
	const valueRange = maxValue - minValue;
	const normalizedValue = valueRange > 0 ? (value - minValue) / valueRange : 0.5;
	return Math.max(0, normalizedValue) * 120;
}

export function HighLowHueTextWrapper({
	value,
	minValue,
	maxValue,
	children,
}: {
	value: number;
	minValue: number;
	maxValue: number;
	children?: React.ReactNode;
}) {
	const hue = getHighLowHue(value, minValue, maxValue);

	return (
		<span
			className={
				"text-[hsl(var(--value-hue)_85%_40%)] dark:text-[hsl(var(--value-hue)_75%_62%)]"
			}
			style={
				{
					"--value-hue": hue,
				} as CSSProperties
			}
		>
			{children}
		</span>
	);
}
