import { styled } from "styled-components";
import Button from "./common/Button/Button";
import { mediaSize } from "../styles/Global";

// "m-6 w-9/10 min-w-[400px] max-w-[800px] h-[500px] drop-shadow-xl p-2 bg-slate-100 rounded-2xl"
export const CreatorWrapper = styled.div`
    margin: auto;

    /* width: 100%; */

    min-width: 300px;
    width: 95%;
    max-width: 720px;

    display: flex;
    flex-direction: column;
    align-items: center;

    margin-top: 15px;
    margin-bottom: 65px;

    border: ${(props) => (props.outline ? "2px solid" : "none")};
    border-color: ${(props) => props.theme.background300};
    border-top-right-radius: 12px;
    border-top-left-radius: 12px;
    overflow: hidden;

    @media (max-width: ${mediaSize.small}px) {
        border-top-right-radius: 0px;
        border-top-left-radius: 0px;
        height: 100%;
        width: 100%;
        border: none;
        margin-top: 0px;
    }
`;

// "flex justify-center mb-1 border-b-0 border-gray-200 w-full";
export const TabsWrapper = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: 15px;
    width: 100%;
    /* gap: 12px; */

    background-color: ${(props) => props.theme.background300};

    @media (max-width: ${mediaSize.small}px) {
    }
`;

// "h-[400px] flex justify-center items-center text-center"
export const ContentWrapper = styled.div`
    display: flex;
    justify-content: center;
    text-align: center;
    align-items: top;
    min-height: 500px;

    padding: 0 15px;

    /* width: 200px; */

    @media (max-width: ${mediaSize.small}px) {
        margin-bottom: 40px;
    }
    @media (min-width: ${mediaSize.small}px) {
        /* padding-top: 10px; */
        /* height: 360px; */
    }
`;

export const NavigationPaneWrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    padding: 10px 10px;
    z-index: 10;

    background-color: ${(props) => props.theme.background};

    @media (max-width: ${mediaSize.small}px) {
        border-top: 1px solid ${(props) => props.theme.borderSoft};

        position: fixed;
        bottom: 0;
    }
`;

export const NavigationButton = styled(Button)`
    width: 130px;
    padding: 4px 4px;
    height: 38px;
`;
