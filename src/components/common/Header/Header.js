import { BiAdjust, BiSolidBadgeCheck } from "react-icons/bi";
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
import { FaUserCheck, FaUserPlus } from "react-icons/fa";
import useUserContext from "../../../hooks/use-user-context";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    APPROVED,
    DENIED,
    PATH_APPROVALS,
    PATH_HOME,
} from "../../../helpers/constants";
import useFormContext from "../../../hooks/use-form-context";
import ApprovalModal from "../Modal/ApprovalModal";

function Header({ toggleTheme, handleShowLogin, handleLogoClick }) {
    const theme = useTheme();
    const { user, isAdmin } = useUserContext();
    const { approval, date } = useFormContext();
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const [showApprovalModal, setShowApprovalModal] = useState(false);

    const isDev = process.env.REACT_APP_DEBUG_TEXT === "DevMode";

    let tickColor = theme.textSoft;
    let subStatus = "Not Submitted";
    if (!!date && (!approval?.status || approval.date < date)) {
        tickColor = theme.warning;
        subStatus = "Awaiting Review";
    } else if (approval?.status === DENIED) {
        tickColor = theme.error;
        subStatus = "Changes Requested";
    } else if (approval?.status === APPROVED) {
        tickColor = theme.warning;
        subStatus = "Approved";
    }

    if (!date) {
        tickColor = theme.textSoft;
    } else {
        if (approval?.status === APPROVED) {
            tickColor = theme.success;
        } else if (approval?.status === DENIED) {
            tickColor = theme.error;
        }
    }

    function handleApprovalSelect() {
        setShowApprovalModal(true);
    }

    function handleCloseApprovalModal() {
        setShowApprovalModal(false);
    }

    return (
        <>
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
                        small
                    >
                        <HeaderButtonContent>
                            <BiAdjust />
                        </HeaderButtonContent>
                    </Button>
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
                    {user && pathname === PATH_HOME ? (
                        <Button small onClick={handleApprovalSelect}>
                            <HeaderButtonContent color={tickColor}>
                                <p>{subStatus}</p>
                                <BiSolidBadgeCheck />
                            </HeaderButtonContent>
                        </Button>
                    ) : null}
                    <Button small onClick={handleShowLogin}>
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
            <ApprovalModal
                show={showApprovalModal}
                handleClose={handleCloseApprovalModal}
                submissionDate={date}
                approval={approval}
                highlightColor={tickColor}
            />
        </>
    );
}

export default Header;
