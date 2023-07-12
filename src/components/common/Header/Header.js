import { BiAdjust, BiSave, BiUser } from "react-icons/bi";
import Button from "../Button/Button";
import {
    AccountButton,
    HeaderConcordSigil,
    HeaderSigilWrapper,
    HeaderWrapper,
    SaveButton,
    ToggleThemeButton,
} from "./Header.style";
import ConcordSigil from "../../../data/images/concord-logo.png";
import ConcordSigilInv from "../../../data/images/concord-logo-inv.png";
import { useTheme } from "styled-components";
import {
    AiFillAccountBook,
    AiFillProfile,
    AiOutlineUser,
    AiTwotoneProfile,
} from "react-icons/ai";

function Header({ toggleTheme, handleShowLogin, user }) {
    const theme = useTheme();

    console.log(user);

    return (
        <HeaderWrapper>
            <div style={{ flex: 1 }}>
                <ToggleThemeButton onClick={toggleTheme}>
                    <BiAdjust></BiAdjust>
                </ToggleThemeButton>
            </div>

            <HeaderSigilWrapper
                href='https://wiki.concordlarp.com/index.php/Main_Page'
                target='_blank'
                rel='noreferrer'
            >
                <Button style={{ height: "100%", width: "100%" }}>
                    <HeaderConcordSigil
                        src={
                            theme.name === "light"
                                ? ConcordSigil
                                : ConcordSigilInv
                        }
                    />
                </Button>
            </HeaderSigilWrapper>

            <div
                style={{
                    flex: 1,
                    justifyContent: "right",
                    display: "flex",
                    gap: "8px",
                }}
            >
                {false && (
                    <SaveButton
                        disabled={true}
                        onClick={() => alert("Saving...")}
                    >
                        <BiSave></BiSave>
                    </SaveButton>
                )}
                <AccountButton onClick={handleShowLogin}>
                    <div
                        style={{
                            display: "flex",
                            alignContent: "center",
                            lineHeight: "1.3rem",
                            gap: "8px",
                        }}
                    >
                        <div
                            style={{
                                fontSize: "1rem",
                            }}
                        >
                            {user ? user.displayName : "Sign in"}
                        </div>
                        <BiUser />
                    </div>
                </AccountButton>
            </div>
        </HeaderWrapper>
    );
}

export default Header;
