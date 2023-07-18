import { styled } from "styled-components";

export const StyledRealmItem = styled.div`
    display: flex;
    align-items: center;

    scale: ${(props) => (props.active ? "1.35" : "1")};
    width: 100px;
    height: 130px;

    filter: ${(props) =>
        props.selection && !props.active ? "blur(2px)" : "none"};
    opacity: ${(props) => (props.selection && !props.active ? "0.65" : "1")};

    @media (min-width: ${(props) => props.theme.small}) {
        transition-duration: 0.2s;
        &:hover {
            scale: ${(props) => (props.active ? "1.35" : "1.15")};
        }
    }
    @media (max-width: ${(props) => props.theme.small}) {
        width: 80px;
        height: 90px;
    }
`;
