import { createGlobalStyle, styled } from "styled-components";

export const mediaSize = {
    small: 600,
};

export const GlobalStyle = createGlobalStyle`
  html, body {
    background-color: ${(props) => props.theme.background};
    color: ${(props) => props.theme.text};
    border-color: ${(props) => props.theme.border};
    transition-duration: 0.2s;
    font-family: Georgia, "Times New Roman", Times, serif;
    font-size: 17px;

    @media (max-width: ${mediaSize.small}px) {
      font-size: 17px;  
    }
  }

  h1, h2 {
    color: ${(props) => props.theme.textStrong};
  }
`;

// "h-[100vh] flex justify-center bg-gradient-to-b from-white to-slate-300 font-serif";
export const StyledApp = styled.div`
    &::-webkit-scrollbar {
        display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
`;

export const FlexCenter = styled.div`
    display: flex;
    justify-content: center;
`;
