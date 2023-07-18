import { styled } from "styled-components";

export const ContentPaneWrapper = styled.div`
    position: relative;

    width: 300px;

    /* height: fit-content; */
    @media (max-width: ${(props) => props.theme.small}) {
        margin-bottom: 10px;
        width: 100%;
    }
`;

export const ContentPaneContent = styled.div`
    &::-webkit-scrollbar {
        width: 0px !important;
        background: transparent;
        display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
    overflow: auto;
    display: flex;
    flex-direction: column;

    position: relative;
    z-index: 2;

    width: 100%;
    height: 100%;
`;

export const PaneBackgroundImage = styled.img`
    display: none;

    position: absolute;
    top: 0;
    left: 50%;
    width: 100%;
    height: auto;

    filter: blur(0px);
    opacity: 0.1;
    z-index: 0;

    transform: ${(props) =>
        props.imageCenter ? "translate(-50%, 5%)" : "translate(-100%, 5%)"};

    @media (max-width: ${(props) => props.theme.small}) {
        ${(props) => !props.mobileShow && "display: none;"}
    }
`;
