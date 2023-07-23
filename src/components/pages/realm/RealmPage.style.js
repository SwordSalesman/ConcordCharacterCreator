import { styled } from "styled-components";

export const RealmDescriptionWrapper = styled.div`
    // border-l border-gray-300 m-2 pl-2 text-left
    border-left: 1px solid ${(props) => props.theme.border};
    margin: 8px;
    padding-left: 8px;
    text-align: left;
`;
