import { styled } from "styled-components";
import { mediaSize } from "../../../styles/Global";

export const AccordionWrapper = styled.div`
    &::-webkit-scrollbar {
        width: 0px !important;
        background: transparent;
        display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;

    display: flex;
    flex-direction: column;
    gap: 0px;
`;

export const AccordionHeader = styled.button`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 3px 6px;
    margin: 2px 0;

    border-style: solid;
    border-width: 1px;
    border-radius: 6px;

    transition: 0.2s;

    background: ${(props) => props.theme.backgroundRaised};
    border-color: ${(props) => props.theme.border};

    &:hover {
        cursor: pointer;
    }

    @media (max-width: ${mediaSize.small}px) {
        padding: 8px 11px;
    }
`;

export const AccordionContent = styled.div`
    display: flex;
    flex-wrap: wrap;

    justify-content: left;
    gap: 0px;

    /* background-color: ${(props) => props.theme.background};
    border-radius: 15px; */

    overflow: auto;
    overflow-x: hidden;
    &::-webkit-scrollbar {
        width: 0px !important;
        background: transparent;
        display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;

    transition: all;
    /* transition-duration: 0.4s; */

    height: ${(props) => (props.expanded ? "fit-content" : "0px")};
    margin-bottom: ${(props) => (props.expanded ? "10px" : "0px")};

    @media (max-width: ${mediaSize.small}px) {
        /* justify-content: center; */
        /* align-items: center; */
        max-height: ${(props) => (props.expanded ? "fit-content" : "0px")};
        transition-duration: 0s;
    }
`;

export const AccordionArrow = styled.div`
    margin-right: 5px;

    transition-duration: 0.3s;

    transform: ${(props) =>
        props.expanded ? "rotate(0deg)" : "rotate(-180deg)"};
`;
