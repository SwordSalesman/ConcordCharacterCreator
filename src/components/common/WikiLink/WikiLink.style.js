import { styled } from "styled-components";
import { mediaSize } from "../../../styles/Global";

export const StyledWikiLink = styled.div`
    border-radius: 10px;
    width: 25px;
    height: 25px;

    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
        cursor: help;
    }

    color: ${(props) => props.theme.light};
    background: ${(props) => props.theme.wikiButton};

    @media (max-width: ${mediaSize.small}px) {
        width: 30px;
        height: 30px;
    }
`;
