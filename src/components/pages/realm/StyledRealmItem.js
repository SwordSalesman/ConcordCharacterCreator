import { styled } from "styled-components";

export const StyledRealmItem = styled.div`
    transition-duration: 0.2s;
    display: flex;
    align-items: center;

    //width: ${(props) => (props.active ? "130px" : "100px")};
    width: 100px;
    height: 130px;

    filter: ${(props) =>
        props.selection && !props.active ? "blur(2px)" : "blur(0)"};
    opacity: ${(props) => (props.selection && !props.active ? "0.65" : "1")};

    @media (min-width: ${(props) => props.theme.small}) {
        scale: ${(props) => (props.active ? "1.35" : "1")};
        &:hover {
            scale: ${(props) => (props.active ? "1.35" : "1.15")};
        }
    }
    @media (max-width: ${(props) => props.theme.small}) {
        scale: ${(props) => (props.active ? "1.35" : "1")};
        /* width: ${(props) => (props.active ? "90px" : "80px")}; */
        width: 80px;
        height: 90px;
    }
`;
