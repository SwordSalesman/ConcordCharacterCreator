import { styled } from "styled-components";
import Button from "../../common/Button/Button";

export const ReviewPageWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px;
    width: 100%;
    padding: 0 10%;
`;

export const ReviewPaneWrapper = styled.div`
    display: flex;
    justify-content: center;
    line-height: 1.1rem;
    width: 100%;
    height: 100%;

    overflow: scroll;
    &::-webkit-scrollbar {
        width: 0px !important;
        background: transparent;
        display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
`;

export const ReviewReminder = styled.p`
    font-style: italic;
    font-size: 0.8rem;
    opacity: 0.7;
`;

// "w-full h-[2px] m-1 bg-gradient-to-r from-transparent via-gray-500 to-transparent"
export const StyledBorder = styled.div`
    width: 100%;
    height: 1px;
    background: ${(props) => props.theme.border};
    background: linear-gradient(
        90deg,
        rgba(0, 0, 0, 0) 0%,
        ${(props) => props.theme.border} 50%,
        rgba(0, 0, 0, 0) 100%
    );
`;

export const ReviewSubtitles = styled.div`
    font-style: italic;
    color: ${(props) => props.theme.textSoft};
`;

export const ReviewHeader = styled.div`
    color: ${(props) => props.theme.textSoft};
    font-size: 0.8rem;
    line-height: 0.8rem;
`;

export const ReviewSection = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    text-align: center;
`;

export const ReviewContent = styled.div`
    color: ${(props) => props.theme.textStrong};
    text-wrap: balance;
`;
