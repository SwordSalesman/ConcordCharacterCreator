import { styled } from "styled-components";

// "m-6 w-9/10 min-w-[400px] max-w-[800px] h-[500px] drop-shadow-xl p-2 bg-slate-100 rounded-2xl"
export const CreatorWrapper = styled.div`
    margin: auto;

    width: 95%;
    min-width: 300px;
    max-width: 620px;
`;

// "flex justify-center mb-1 border-b-0 border-gray-200 w-full";
export const TabsWrapper = styled.div`
    display: flex;
    justify-content: space-around;
    margin-bottom: 10px;
    gap: 12px;
`;

// "h-[400px] flex justify-center items-center text-center"
export const ContentWrapper = styled.div`
    display: flex;
    justify-content: center;
    text-align: center;
    align-items: top;
    min-height: 360px;

    @media (max-width: ${(props) => props.theme.small}) {
        margin-bottom: 10px;
    }
    @media (min-width: ${(props) => props.theme.small}) {
        height: 360px;
    }
`;

export const NavigationPaneWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 10px;

    @media (max-width: ${(props) => props.theme.small}) {
        width: 100%;
        padding: 0 10px;
        margin-top: 20px;
        margin-bottom: 20px;

        //background-color: ${(props) => props.theme.backgroundRaised};
        z-index: 10;
    }
`;
