import { styled } from "styled-components";

export const StyledSectionDivider = styled.div`
  display: flex;
  justify-content: center;
  gap: 6px;
  margin: 0px 0px 4px 0px;

  border-style: solid;
  border-bottom-width: 1px;
  border-color: ${(props) => props.theme.border};

  transition: 0.2s;
`;

export const StyledSectionValue = styled.div``;
