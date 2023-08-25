import { styled } from "styled-components";
import { mediaSize } from "../../../styles/Global";

export const StyledTabItem = styled.button`
    border-bottom: 3px solid;
    border-color: #ffffff00;

    margin-bottom: 10px;
    height: 30px;
    transition: 0.2s;

    padding: 0;

    &::selection {
        border-color: ${(props) => props.theme.outline};
    }

    border-color: ${(props) =>
        props.primary ? props.theme.special : "#ffffff00"};
    color: ${(props) =>
        props.primary ? props.theme.textStrong : props.theme.text};

    opacity: ${(props) => (props.primary ? "1.0" : "0.6")};
    flex: 1;

    @media (max-width: ${mediaSize.small}px) {
        opacity: ${(props) => (props.primary ? "1.0" : "0.25")};
        border-color: ${(props) =>
            props.primary ? props.theme.special : props.theme.textSoft};
    }
`;
