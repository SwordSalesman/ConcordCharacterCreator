import { styled } from "styled-components";
import Button from "../common/Button/Button";

// "m-6 w-9/10 min-w-[400px] max-w-[800px] h-[500px] drop-shadow-xl p-2 bg-slate-100 rounded-2xl"
export const HeaderWrapper = styled.div`
  height: 36px;
  width: 100%;
  padding: 0 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: ${(props) => "0 0 10px " + props.theme.shadow};
  background-color: ${(props) => props.theme.backgroundRaised};

  margin-bottom: 30px;
  @media (max-width: ${(props) => props.theme.small}) {
    margin-bottom: 20px;
  }
`;

export const ToggleThemeButton = styled(Button)`
  height: 26px;
`;

export const HeaderConcordSigil = styled.img`
  height: 25px;
  margin: auto;
`;

export const SaveButton = styled(Button)`
  height: 26px;
`;
export const AccountButton = styled(Button)`
  height: 26px;
  display: flex;
  align-items: center;

  font-family: sans-serif;
  font-size: 15px;

  gap: 5px;
`;
