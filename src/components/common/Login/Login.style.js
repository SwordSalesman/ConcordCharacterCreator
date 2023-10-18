import styled from "styled-components";

export const FieldWarning = styled.p`
    color: ${(props) => props.theme.error};
    font-style: italic;
    font-size: 0.8em;
    margin-bottom: 12px;
`;
