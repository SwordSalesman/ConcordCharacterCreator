import { styled } from "styled-components";
import Button from "../Button/Button";

// "m-6 w-9/10 min-w-[400px] max-w-[800px] h-[500px] drop-shadow-xl p-2 bg-slate-100 rounded-2xl"
export const HeaderWrapper = styled.div`
    /* height: 36px; */
    width: 100%;
    padding: 4px 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 24px;
    /* box-shadow: ${(props) => "0 0 10px " + props.theme.shadow}; */
    background-color: ${(props) => props.theme.background};
    border-bottom: 1px solid ${(props) => props.theme.borderSoft};

    /* margin-bottom: 30px; */
    position: fixed;
    top: 0;
    z-index: 10;
`;

export const ToggleThemeButton = styled(Button)``;

export const HeaderSigilWrapper = styled.a`
    height: 42px;
    width: 42px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const HeaderConcordSigil = styled.img`
    height: 25px;
    width: 25px;
    margin: auto;
`;

export const SaveButton = styled(Button)``;

export const AccountButton = styled(Button)``;
