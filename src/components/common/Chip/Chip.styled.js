import { styled } from "styled-components";

/*
    "px-[5px] m-[2px] h-6 w-fit",
  "border border-gray-300 rounded-lg",
  "flex items-center",
  "cursor-pointer select-none",
  "whitespace-nowrap",
  "transition-all",
  rest.className,
  {
    "bg-gray-50 hover:bg-gray-200": !inactive,
    "drop-shadow bg-white": shadow,
    "bg-gray-100 text-gray-400 cursor-auto": inactive,
    "bg-slate-500 hover:bg-slate-400 text-white": selected,
  }
*/

export const StyledChip = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
    padding: 0 5px 0 3px;
    margin: 2px;
    transition-duration: 0.2s;

    border-width: 1px;
    border-radius: 20px;

    @media (min-width: ${(props) => props.theme.small}) {
        &:hover {
            filter: brightness(0.9);
        }
    }
    @media (max-width: ${(props) => props.theme.small}) {
        /* font-size: 26px; */
        /* gap: 10px; */
        padding: 5px 10px 5px 8px;
    }

    background-color: ${(props) =>
        props.selected
            ? props.theme.specialBg
            : props.disabled
            ? props.theme.backgroundRaised
            : props.theme.background};
    color: ${(props) =>
        props.selected
            ? props.theme.light
            : props.disabled
            ? props.theme.border
            : props.theme.text};
    border-color: ${(props) =>
        props.selected
            ? props.theme.special
            : props.disabled
            ? props.theme.border
            : props.theme.border};

    /* box-shadow: ${(props) =>
        props.shadow ? "0 0 5px " + props.theme.shadow : "0"}; */
`;

export const SkillCost = styled.div`
    //color: ${(props) => props.theme.special};
    border-width: 1px;
    border-radius: 20px;
    border-color: inherit;

    font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS",
        sans-serif;

    line-height: 18px;

    width: 20px;
    height: 20px;
`;
