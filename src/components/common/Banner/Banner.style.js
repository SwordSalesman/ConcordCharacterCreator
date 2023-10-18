import styled, { css } from "styled-components";
import { mediaSize } from "../../../styles/Global";

export const BannerSpacer = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
`;

export const BannerWrapper = styled.div`
    cursor: pointer;
    margin: 15px 0 0 0;
    padding: ${(props) => (props.expanded ? "10px 24px" : "12px")};
    color: white;
    border-radius: 12px;
    position: relative;

    height: ${(props) => (props.expanded ? "70px" : "26px")};
    width: ${(props) => (props.expanded ? "95%" : "160px")};
    max-width: 720px;
    overflow: hidden;

    background: rgb(153, 153, 153);
    ${(props) =>
        props.type === "success" &&
        css`
            background: ${(props) => props.theme.bannerSuccess};
        `}
    ${(props) =>
        props.type === "warning" &&
        css`
            background: ${(props) => props.theme.bannerWarning};
        `}

    transition: all;
    transition-duration: 0.4s;

    @media (max-width: ${mediaSize.small}px) {
        margin: 10px 0 10px 0;
    }

    animation-duration: 2s;
    animation-timing-function: ease-in-out;
    animation-name: createBanner;

    @keyframes createBanner {
        from {
            transform: scale(0);
            opacity: 0;
            height: 0;
            margin: 0;
            padding: 0;
        }
        to {
            transform: scale(1);
            opacity: 1;
            height: 70px;
            margin: 10px 0 10px 0;

            @media (max-width: ${mediaSize.small}px) {
                margin: 10px 0 10px 0;
            }
        }
    }
`;

export const BannerArrow = styled.div`
    position: absolute;
    right: 5px;
    top: ${(props) => (props.expanded ? "22px" : "-3px")};

    transition-duration: 0.4s;

    transform: ${(props) =>
        props.expanded ? "rotate(0deg)" : "rotate(-180deg)"};
`;

export const BannerContent = styled.div`
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    /* justify-content: ${(props) => (props.expanded ? "center" : "left")}; */
    padding-right: ${(props) => (props.expanded ? "0" : "15px")};
    justify-content: center;
    align-items: center;
    text-align: center;
    text-wrap: balance;

    @media (max-width: ${mediaSize.small}px) {
        font-size: 1rem;
        line-height: 1.2em;
    }

    /* animation-delay: 0.9s;
    animation-duration: 0.5s;
    animation-name: createBannerContent;

    @keyframes createBannerContent {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    } */
`;

export const FullText = styled.div`
    position: absolute;
    transition: all;
    transition-duration: 0.4s;
    opacity: ${(props) => (props.expanded ? "1" : "0")};
`;

export const SummaryText = styled.div`
    position: absolute;
    transition: all;
    transition-duration: 0.4s;
    opacity: ${(props) => (props.expanded ? "0" : "1")};
`;
