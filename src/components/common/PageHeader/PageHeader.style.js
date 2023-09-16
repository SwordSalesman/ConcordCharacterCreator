import styled from "styled-components";
import { mediaSize } from "../../../styles/Global";

export const PageHeaderWrapper = styled.div`
    display: flex;
    justify-content: space-around;
    /* margin-bottom: 15px; */
    width: 100%;
    color: ${(props) => props.theme.textStrong};
    background-color: ${(props) => props.theme.background300};
    /* text-transform: "capitalize"; */
    /* font-weight: 800; */
    /* letter-spacing: 2px; */
    font-size: 1.2rem;
`;
