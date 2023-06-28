import { styled } from "styled-components";

/*
  classNames(
    "w-fit rounded-lg select-none",
    "border cursor-pointer",
    "transition-all",
    "m-1 py-1 px-2",
    rest.className,
    {
      "bg-gray-100 border-gray-500 hover:bg-gray-300 active:bg-gray-400":
        !disabled,
      "bg-gray-500 hover:bg-gray-600 active:bg-gray-700 text-white border-gray-500 hover:border-gray-600":
        active && !disabled,
      "bg-gray-200 text-gray-400 border-gray-400 cursor-auto": disabled,
      "w-6 h-6 rounded-full py-0.5 px-0.5": icon,
    }
  );
*/
export const StyledButton = styled.button`
  border-radius: 8px;
  border-style: solid;
  border-width: 1px;

  padding: 4px 8px;
  transition: 0.2s;

  &:hover {
    filter: brightness(0.9);
  }

  &::selection {
    border-color: ${(props) => props.theme.outline};
  }

  border-color: ${(props) =>
    props.primary ? props.theme.specialBg : props.theme.border};
  background-color: ${(props) =>
    props.disabled
      ? props.theme.backgroundRaised
      : props.primary
      ? props.theme.specialBg
      : props.theme.background};
  color: ${(props) =>
    props.disabled
      ? props.theme.border
      : props.primary
      ? props.theme.light
      : props.theme.text};
`;
