import { StyledSectionDivider, StyledSectionValue } from "./SectionDivider.style";

function SectionDivider({ left, right }: { left: string; right?: string }) {
	return (
		<StyledSectionDivider>
			<div>{left}</div>
			{right && <StyledSectionValue>{right}</StyledSectionValue>}
		</StyledSectionDivider>
	);
}

export default SectionDivider;
