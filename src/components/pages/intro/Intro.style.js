import { styled } from "styled-components";
import Button from "../../common/Button/Button";

export const TitleWrapper = styled.h1`
    font-size: 1.2rem;
    padding: 8px;
    background: ${(props) =>
        `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${props.theme.backgroundRaised} 50%, rgba(0,0,0,0) 100%);`};
`;

export const GameTally = styled.div`
    font-size: 1.4rem;
    width: 50px;
    font-family: sans-serif;
`;

export const ResetButton = styled(Button)``;
