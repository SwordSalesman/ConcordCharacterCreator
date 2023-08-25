import { styled } from "styled-components";
import { mediaSize } from "../../../styles/Global";

export const StyledRealmItem = styled.button`
    display: flex;
    align-items: center;

    scale: ${(props) => (props.active ? "1.35" : "1")};
    width: 100px;
    height: 100px;

    filter: ${(props) =>
        props.selection && !props.active ? "blur(2px)" : "none"};
    opacity: ${(props) => (props.selection && !props.active ? "0.65" : "1")};

    @media (min-width: ${mediaSize.small}px) {
        transition-duration: 0.2s;
        &:hover {
            scale: ${(props) => (props.active ? "1.35" : "1.15")};
        }
    }
    @media (max-width: ${mediaSize.small}px) {
        width: 80px;
        height: 90px;
    }
`;
