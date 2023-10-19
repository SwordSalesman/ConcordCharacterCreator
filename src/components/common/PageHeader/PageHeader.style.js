import styled from "styled-components";

export const PageHeaderWrapper = styled.div`
    display: flex;
    justify-content: space-around;
    width: 100%;
    color: ${(props) => props.theme.textStrong};
    background-color: ${(props) => props.theme.background300};
    font-size: 1.2rem;
`;
