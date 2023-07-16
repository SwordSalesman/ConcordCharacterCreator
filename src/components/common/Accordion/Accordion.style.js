import { styled } from "styled-components";

export const AccordionWrapper = styled.div`
    &::-webkit-scrollbar {
        width: 0px !important;
        background: transparent;
        display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;

    display: flex;
    flex-direction: column;
    gap: 0px;
`;

/*
"flex justify-between p-1 px-2 bg-gradient-to-r from-gray-100 to-gray-50 border border-gray-300 rounded items-center cursor-pointer"
*/
export const AccordionHeader = styled.button`
    display: flex;
    justify-content: space-between;
    padding: 3px 6px;
    margin: 2px 0;

    border-style: solid;
    border-width: 1px;
    border-radius: 6px;

    transition: 0.2s;

    background: ${(props) => props.theme.backgroundRaised};
    border-color: ${(props) => props.theme.border};

    &:hover {
        cursor: pointer;
    }

    @media (max-width: ${(props) => props.theme.small}) {
        padding: 8px 11px;
    }
`;

/*
  "m-1",
  "flex w-full flex-wrap overflow-auto overflow-x-hidden max-h-0",
  "transition-all duration-[500ms]",
  {
    "max-h-52": expanded,
  }
*/
export const AccordionContent = styled.div`
    display: flex;
    flex-wrap: wrap;

    justify-content: left;
    gap: 0px;

    overflow: auto;
    overflow-x: hidden;
    &::-webkit-scrollbar {
        width: 0px !important;
        background: transparent;
        display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;

    transition: all;
    transition-duration: 0.4s;

    max-height: ${(props) => (props.expanded ? "250px" : "0px")};

    @media (max-width: ${(props) => props.theme.small}) {
        justify-content: center;
    }
`;
