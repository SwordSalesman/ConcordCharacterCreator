import { BiAdjust, BiSave } from "react-icons/bi";
import Button from "../Button/Button";
import {
    HeaderConcordSigil,
    HeaderSigilWrapper,
    HeaderSmallButton,
    HeaderSpacer,
    HeaderWrapper,
} from "./Header.style";
import ConcordSigil from "../../../data/images/concord-logo.png";
import ConcordSigilInv from "../../../data/images/concord-logo-inv.png";
import { useTheme } from "styled-components";
import { FaUserCheck, FaUserPlus } from "react-icons/fa";
import useFormContext from "../../../hooks/use-form-context";

const headerSaveButton = false;

function Header({ toggleTheme, handleShowLogin, handleSave, user }) {
    const theme = useTheme();
    const { unsaved } = useFormContext();

    // console.log(user);

    return (
        <>
            <HeaderWrapper>
                <div style={{ display: "flex", flex: 1, gap: "4px" }}>
                    <HeaderSmallButton
                        onClick={() => {
                            toggleTheme();
                        }}
                    >
                        <BiAdjust />
                    </HeaderSmallButton>
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
                        display: "flex",
                        flex: 1,
                        gap: "4px",
                        justifyContent: "right",
                    }}
                >
                    {user && headerSaveButton && (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "right",
                            }}
                        >
                            {false && (
                                <div
                                    style={{
                                        fontSize: "16px",
                                        transition: "0.2s",
                                        opacity: unsaved ? "0.4" : "0",
                                        width: unsaved ? "60px" : "0px",
                                        height: "1.6rem",
                                        lineHeight: "0.8rem",
                                    }}
                                >
                                    unsaved changes
                                </div>
                            )}
                            <HeaderSmallButton onClick={handleSave}>
                                <BiSave />
                            </HeaderSmallButton>
                        </div>
                    )}
                    <HeaderSmallButton onClick={handleShowLogin}>
                        <div
                            style={{
                                display: "flex",
                                alignContent: "center",
                                lineHeight: "1.3rem",
                                gap: "8px",
                            }}
                        >
                            {!user && (
                                <div
                                    style={{
                                        fontSize: "1rem",
                                    }}
                                >
                                    {"Sign in"}
                                </div>
                            )}
                            {user ? <FaUserCheck /> : <FaUserPlus />}
                        </div>
                    </HeaderSmallButton>
                </div>
            </HeaderWrapper>
        </>
    );
}

export default Header;
