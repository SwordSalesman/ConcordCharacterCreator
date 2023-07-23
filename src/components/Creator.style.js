import { styled } from "styled-components";
import Button from "./common/Button/Button";

// "m-6 w-9/10 min-w-[400px] max-w-[800px] h-[500px] drop-shadow-xl p-2 bg-slate-100 rounded-2xl"
export const CreatorWrapper = styled.div`
    margin: auto;

    /* width: 100%; */

    /* min-width: 300px; */
    max-width: 620px;
    display: flex;
    flex-direction: column;
    align-items: center;

    margin-top: 65px;
    margin-bottom: 65px;
`;

// "flex justify-center mb-1 border-b-0 border-gray-200 w-full";
export const TabsWrapper = styled.div`
    display: flex;
    justify-content: space-around;
    margin-bottom: 15px;
    width: 95%;
    gap: 12px;
    @media (max-width: ${(props) => props.theme.small}) {
        width: auto;
        gap: 0px;
    }
`;

// "h-[400px] flex justify-center items-center text-center"
export const ContentWrapper = styled.div`
    display: flex;
    justify-content: center;
    text-align: center;
    align-items: top;
    min-height: 440px;

    width: 95%;

    @media (max-width: ${(props) => props.theme.small}) {
        margin-bottom: 10px;
    }
    @media (min-width: ${(props) => props.theme.small}) {
        height: 360px;
    }
`;

export const NavigationPaneWrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    /* margin-top: 10px; */
    padding: 0 10px;
    z-index: 10;

    background-color: ${(props) => props.theme.background};
    /* box-shadow: ${(props) => "0 0 15px " + props.theme.shadow}; */

    @media (max-width: ${(props) => props.theme.small}) {
        border-top: 1px solid ${(props) => props.theme.borderSoft};

        position: fixed;
        bottom: 0;
        height: 50px;
        //background-color: ${(props) => props.theme.backgroundRaised};
    }
`;

export const NavigationButton = styled(Button)`
    width: 130px;
    padding: 4px 4px;
    height: 38px;
`;
