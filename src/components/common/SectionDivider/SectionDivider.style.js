import { styled } from "styled-components";
import { mediaSize } from "../../../styles/Global";

export const StyledSectionDivider = styled.div`
    display: flex;
    justify-content: center;
    gap: 6px;
    /* margin: auto;
  margin-top: 0px;
  margin-bottom: 5px;
  width: fit-content; */

    /* border-style: solid;
  border-bottom-width: 1px;
  border-color: ${(props) => props.theme.special}; */

    color: ${(props) => props.theme.special};
`;

export const StyledSectionValue = styled.div``;

export const SectionWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 5px;

    @media (min-width: ${mediaSize.small}px) {
        margin-bottom: 15px;
    }
`;
