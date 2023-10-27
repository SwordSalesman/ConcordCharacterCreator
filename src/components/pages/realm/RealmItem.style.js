import { styled } from "styled-components";
import { mediaSize } from "../../../styles/Global";

export const StyledRealmItem = styled.button`
    display: flex;
    align-items: center;
    scale: ${(props) => (props.active ? "1.35" : "1")};
    transition-duration: 0.2s;
    width: 70px;
    height: 70px;

    opacity: ${(props) => (props.selection && !props.active ? "0.45" : "1")};

    @media (min-width: ${mediaSize.small}px) {
        width: 100px;
        height: 100px;
        opacity: ${(props) =>
            props.selection && !props.active ? "0.65" : "1"};
        filter: ${(props) =>
            props.selection && !props.active ? "blur(2px)" : "none"};
        &:hover {
            scale: ${(props) => (props.active ? "1.35" : "1.15")};
        }
    }

    img {
        ${(props) =>
            props.theme.name === "dark"
                ? "filter: brightness(10)"
                : "filter: brightness(0.2)"};
    }

    /* background-color: red; */
`;
