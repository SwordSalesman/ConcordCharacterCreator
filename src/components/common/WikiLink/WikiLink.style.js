import { styled } from "styled-components";

/*
  const classes = classNames(
  "text-white opacity-50 bg-slate-500 hover:bg-slate-400",
  "rounded-lg w-[25px] h-[25px] text-xl",
  "cursor-help transition-all",
  "flex justify-center items-center",
  rest.className
);
*/

export const StyledWikiLink = styled.div`
    border-radius: 10px;
    width: 25px;
    height: 25px;

    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
        cursor: help;
    }

    color: ${(props) => props.theme.light};
    background: ${(props) => props.theme.specialBg};
`;
