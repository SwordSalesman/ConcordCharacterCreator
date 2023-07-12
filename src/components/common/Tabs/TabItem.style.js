import { styled } from "styled-components";

export const StyledTabItem = styled.button`
    border-style: solid;
    border-bottom-width: 3px;
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

    opacity: ${(props) => (props.primary ? "1.0" : "0.6")};
    flex: 1;

    @media (max-width: ${(props) => props.theme.small}) {
        font-size: 1rem;
    }
`;
