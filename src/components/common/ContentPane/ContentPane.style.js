import { styled } from "styled-components";

export const ContentPaneWrapper = styled.div`
  &::-webkit-scrollbar {
    width: 0px !important;
    background: transparent;
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;

  display: flex;
  flex-direction: column;
`;
