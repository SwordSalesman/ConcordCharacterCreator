import { styled } from "styled-components";

export const StyledTabItem = styled.button`
  border-style: solid;
  border-bottom-width: 3px;
  border-color: #ffffff00;

  margin-bottom: 10px;
  width: 150px;
  transition: 0.2s;

  &::selection {
    border-color: ${(props) => props.theme.outline};
  }

  border-color: ${(props) =>
    props.primary ? props.theme.special : "#ffffff00"};
`;
