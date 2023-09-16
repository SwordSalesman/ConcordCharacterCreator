import { styled } from "styled-components";
import { mediaSize } from "../../../styles/Global";

export const StyledChip = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
    padding: 1px 6px 1px 4px;
    margin: 2px;
    transition-duration: 0.2s;

    font-size: 0.95rem;
    font-family: Arial, Helvetica, sans-serif;

    border-width: 1px;

    border-radius: ${(props) => (props.skillstyle ? "20px" : "8px")};

    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;

    @media (min-width: ${mediaSize.small}px) {
        &:hover {
            filter: brightness(0.9);
        }
    }
    @media (max-width: ${mediaSize.small}px) {
        /* font-size: 26px; */
        /* gap: 10px; */
        padding: 5px 10px 5px 8px;
    }

    background-color: ${(props) =>
        props.selected
            ? props.theme.specialBg
            : props.disabled
            ? props.theme.backgroundRaised
            : props.theme.background};
    color: ${(props) =>
        props.selected
            ? props.theme.light
            : props.disabled
            ? props.theme.border
            : props.theme.text};
    border-color: ${(props) =>
        props.selected
            ? props.theme.specialOutline
            : props.disabled
            ? props.theme.border
            : props.theme.border};

    /* box-shadow: ${(props) =>
        props.shadow ? "0 0 5px " + props.theme.shadow : "0"}; */
`;

export const SkillCost = styled.div`
    //color: ${(props) => props.theme.special};
    border-width: 1px;
    border-radius: 20px;
    border-color: inherit;

    line-height: 18px;

    width: 20px;
    height: 20px;
`;
