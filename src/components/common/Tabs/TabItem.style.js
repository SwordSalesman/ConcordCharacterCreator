import { styled } from "styled-components";
import { mediaSize } from "../../../styles/Global";

export const StyledTabItem = styled.button`
    border-bottom: 3px solid;
    border-color: #ffffff00;

    /* margin-bottom: 10px; */
    margin-top: 2px;
    height: 30px;
    transition: 0.2s;

    &::selection {
        border-color: ${(props) => props.theme.outline};
    }

    border-color: ${(props) =>
        props.primary ? props.theme.special : "#ffffff00"};
    color: ${(props) =>
        props.primary ? props.theme.textStrong : props.theme.text};

    opacity: ${(props) => (props.primary ? "1.0" : "0.5")};
    flex: 1;

    @media (max-width: ${mediaSize.small}px) {
        display: ${(props) => (props.primary ? "block" : "none")};
        border: none;
        margin: 0;
        font-size: 1.1rem;
        height: 45px;
        /* border-color: ${(props) =>
            props.primary ? props.theme.special : props.theme.textSoft}; */
    }
`;
