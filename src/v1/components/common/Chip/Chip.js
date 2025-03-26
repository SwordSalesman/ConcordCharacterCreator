import { StyledChip } from "./Chip.styled";
import React from "react";
import toast from "react-hot-toast";

function Chip({
	children,
	onClick,
	selected,
	skillstyle,
	shadow,
	inactive,
	inactiveReason,
	...rest
}) {
	const handleClick = () => {
		if (!inactive) {
			onClick();
		} else if (inactiveReason) {
			toast(inactiveReason);
		}
	};

	return (
		<StyledChip
			selected={selected}
			shadow={shadow}
			inactive={inactive}
			onClick={handleClick}
			skillstyle={skillstyle}
			{...rest}
		>
			{children}
		</StyledChip>
	);
}

export default Chip;
