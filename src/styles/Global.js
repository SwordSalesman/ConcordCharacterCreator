import { styled } from "styled-components";

// export const GlobalStyles = createGlobalStyle`
// *,
// *::before,
// *::after {
//   margin: 0;
//   padding: 0;
//   box-sizing: border-box;
//   border-style: solid;
//   border-width: 2px;
// }

// body {
//   background-color: hsl(0, 0%, 100%);
//   color: hsl(0, 1%, 16%);
//   font-family: monospace;
//   overflow-x: hidden;
// }
// `;

// "h-[100vh] flex justify-center bg-gradient-to-b from-white to-slate-300 font-serif";
export const StyledApp = styled.div`
  display: flex;
  justify-content: center;
  height: 100vh;
  min-height: 550px;
  min-width: 650px;
  font-family: Georgia, "Times New Roman", Times, serif;
  transition-duration: 0.2s;

  background-color: ${(props) => props.theme.background};
  color: ${(props) => props.theme.text};
  border-color: ${(props) => props.theme.border};

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
