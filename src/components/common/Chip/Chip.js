import { StyledChip } from "./Chip.styled";
import React from "react";

function Chip({
    children,
    onClick,
    selected,
    skillstyle,
    shadow,
    inactive,
    ...rest
}) {
    const handleClick = () => {
        if (!inactive) {
            onClick();
        }
    };

    return (
        <StyledChip
            selected={selected}
            shadow={shadow}
            disabled={inactive}
            onClick={handleClick}
            skillstyle={skillstyle}
            {...rest}
        >
            {children}
        </StyledChip>
    );
}

export default Chip;
