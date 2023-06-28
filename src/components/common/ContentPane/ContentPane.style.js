import { styled } from "styled-components";

export const ContentPaneWrapper = styled.div`
  position: relative;

  width: 290px;
  height: 390px;
`;

export const ContentPaneContent = styled.div`
  &::-webkit-scrollbar {
    width: 0px !important;
    background: transparent;
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;

  overflow: auto;

  display: flex;
  flex-direction: column;

  width: 100%;
  height: 100%;
`;

export const PaneBackgroundImage = styled.img`
  position: absolute;
  top: 16px;
  width: 100%;

  filter: blur(0px);
  opacity: 0.1;

  z-index: -100;
`;
