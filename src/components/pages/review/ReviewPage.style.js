import { styled } from "styled-components";

export const ReviewPageWrapper = styled.div`
    display: flex;
    justify-content: center;

    @media (max-width: ${(props) => props.theme.small}) {
        padding: 0 30px;
    }
`;

// "w-full h-[2px] m-1 bg-gradient-to-r from-transparent via-gray-500 to-transparent"
export const StyledBorder = styled.div`
    width: 100%;
    height: 2px;
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
    color: ${(props) => props.theme.textStrong};
`;
