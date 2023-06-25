import { styled } from "styled-components";

/*
  const classes = classNames(
  "transition duration-200",
  "px-1 w-28 text-center m-1",
  "cursor-pointer select-none",
  "text-black",
  "border-transparent border-b-2",
  {
    "border-b-red-600 text-red-600 cursor-default": active,
  }
);
*/
export const StyledSectionDivider = styled.div`
  display: flex;
  justify-content: center;
  gap: 6px;
  margin: 0px 0px 4px 0px;

  border-style: solid;
  border-bottom-width: 1px;
  border-color: ${(props) => props.theme.border};

  transition: 0.2s;

  /*
  color: ${(props) => props.theme.background};
  background: rgb(194, 194, 194);
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0) 0%,
    ${(props) => props.theme.textStrong} 30%,
    ${(props) => props.theme.textStrong} 70%,
    rgba(0, 0, 0, 0) 100%
    
  );
  border: none;
  */
`;

export const StyledSectionValue = styled.div``;
