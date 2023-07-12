import classNames from "classnames";
import {
    StyledSectionDivider,
    StyledSectionValue,
} from "./SectionDivider.style";

function SectionDivider({ left, right, ...rest }) {
    return (
        <StyledSectionDivider>
            <div>{left}</div>
            {right && <StyledSectionValue>{right}</StyledSectionValue>}
        </StyledSectionDivider>
    );
}

export default SectionDivider;
