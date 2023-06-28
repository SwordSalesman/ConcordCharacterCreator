import { styled } from "styled-components";

export const ContentPaneWrapper = styled.div`
  position: relative;

  width: 300px;
  margin-bottom: 10px;

  @media (max-width: ${(props) => props.theme.small}) {
    width: 100%;
    height: fit-content;
  }
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
  position: fixed;
  top: 16px;
  width: 300px;

  filter: blur(0px);
  opacity: 0.1;

  z-index: -100;

  @media (max-width: ${(props) => props.theme.small}) {
    ${(props) => !props.forceShow && "display: none;"}
  }
`;
