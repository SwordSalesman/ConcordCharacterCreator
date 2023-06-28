import { BiAdjust, BiSave, BiUser } from "react-icons/bi";
import Button from "../common/Button/Button";
import {
  AccountButton,
  HeaderConcordSigil,
  HeaderWrapper,
  SaveButton,
  ToggleThemeButton,
} from "./Header.style";
import ConcordSigil from "../../data/images/concord-logo.png";
import ConcordSigilInv from "../../data/images/concord-logo-inv.png";
import { useTheme } from "styled-components";
import { AiFillProfile } from "react-icons/ai";

function Header({ toggleTheme, signIn }) {
  const theme = useTheme();
  const user = null;

  return (
    <HeaderWrapper>
      <div style={{ flex: 1 }}>
        <ToggleThemeButton onClick={toggleTheme}>
          <BiAdjust></BiAdjust>
        </ToggleThemeButton>
      </div>

      <div>
        <HeaderConcordSigil
          src={theme.name === "light" ? ConcordSigil : ConcordSigilInv}
        />
      </div>

      <div
        style={{
          flex: 1,
          justifyContent: "right",
          display: "flex",
          gap: "5px",
        }}
      >
        <SaveButton disabled={true} onClick={() => alert("Saving...")}>
          <BiSave></BiSave>
        </SaveButton>
        <AccountButton onClick={() => alert("Signing in...")}>
          <BiUser size={16} />
          {user ? user.name : "Sign In"}
        </AccountButton>
      </div>
    </HeaderWrapper>
  );
}

export default Header;
