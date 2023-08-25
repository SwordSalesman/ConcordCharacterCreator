import { styled } from "styled-components";
import { mediaSize } from "../../../styles/Global";

export const ContentPaneWrapper = styled.div`
    position: relative;

    flex: 1;

    /* height: fit-content; */
    @media (max-width: ${mediaSize.small}px) {
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

    position: relative;
    display: flex;
    flex-direction: column;
    z-index: 2;
    width: 100%;
    height: 100%;
`;

export const PaneBackgroundImage = styled.img`
    /* display: none; */

    position: absolute;
    top: 40%;
    left: 50%;

    width: 300px;
    height: 300px;
    /* right: -100%; */
    /* margin: auto; */

    -moz-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -o-transform: translate(-50%, -50%);
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);

    filter: blur(0px);
    opacity: 0.1;
    z-index: 0;

    /* transform: ${(props) =>
        props.imageCenter ? "translate(-50%, 5%)" : "translate(-100%, 5%)"}; */

    @media (max-width: ${mediaSize.small}px) {
        ${(props) => !props.mobileShow && "display: none;"}
    }
`;
