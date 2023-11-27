import { BiAdjust } from "react-icons/bi";
import Button from "../Button/Button";
import {
    HeaderButtonContent,
    HeaderConcordSigil,
    HeaderSigilWrapper,
    HeaderWrapper,
} from "./Header.style";
import ConcordSigil from "../../../data/images/concord-logo.png";
import ConcordSigilInv from "../../../data/images/concord-logo-inv.png";
import { useTheme } from "styled-components";
import {
    FaAddressCard,
    FaStamp,
    FaUserCheck,
    FaUserPlus,
} from "react-icons/fa";
import useUserContext from "../../../hooks/use-user-context";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PATH_APPROVALS, PATH_HOME } from "../../../helpers/constants";

function Header({ toggleTheme, handleShowLogin, handleLogoClick }) {
    const theme = useTheme();
    const { user, isAdmin } = useUserContext();
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const isDev = process.env.REACT_APP_DEBUG_TEXT === "DevMode";

    return (
        <HeaderWrapper>
            <div
                style={{
                    display: "flex",
                    flex: 1,
                    gap: "4px",
                    alignItems: "center",
                }}
            >
                <Button
                    onClick={() => {
                        toggleTheme();
                    }}
                >
                    <HeaderButtonContent>
                        <BiAdjust />
                    </HeaderButtonContent>
                </Button>
                {isDev ? (
                    <div
                        style={{
                            fontSize: "0.5em",
                            position: "absolute",
                            top: "0",
                            left: "0",
                            lineHeight: "1em",
                            pointerEvents: "none",
                            userSelect: "none",
                            opacity: 0.4,
                        }}
                    >
                        <p>development</p>
                    </div>
                ) : null}
            </div>

            <HeaderSigilWrapper
                href={"https://wiki.concordlarp.com/index.php"}
                target='_blank'
                rel='noreferrer'
            >
                <Button
                    style={{ height: "100%", width: "100%" }}
                    // onClick={handleLogoClick}
                >
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
                    alignItems: "center",
                }}
            >
                {isAdmin ? (
                    <>
                        <Button
                            primary={pathname === PATH_APPROVALS}
                            onClick={() => navigate(PATH_APPROVALS)}
                            small
                        >
                            <HeaderButtonContent to={PATH_APPROVALS}>
                                <p>Approvals</p>
                            </HeaderButtonContent>
                        </Button>
                        <Button
                            primary={pathname === PATH_HOME}
                            onClick={() => navigate(PATH_HOME)}
                            small
                        >
                            <HeaderButtonContent to={PATH_HOME}>
                                <p>Creator</p>
                            </HeaderButtonContent>
                        </Button>
                    </>
                ) : null}
                <Button onClick={handleShowLogin}>
                    <HeaderButtonContent>
                        {user ? (
                            <FaUserCheck />
                        ) : (
                            <>
                                <p>Sign in</p>
                                <FaUserPlus />
                            </>
                        )}
                    </HeaderButtonContent>
                </Button>
            </div>
        </HeaderWrapper>
    );
}

export default Header;
