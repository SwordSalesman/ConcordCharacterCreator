import { BiAdjust, BiSave } from "react-icons/bi";
import Button from "../Button/Button";
import {
    HeaderConcordSigil,
    HeaderSigilWrapper,
    HeaderSmallButton,
    HeaderWrapper,
} from "./Header.style";
import ConcordSigil from "../../../data/images/concord-logo.png";
import ConcordSigilInv from "../../../data/images/concord-logo-inv.png";
import { useTheme } from "styled-components";
import { FaUserCheck, FaUserPlus } from "react-icons/fa";
import { saveUserForm } from "../../../hooks/use-firebase";
import { toast } from "react-hot-toast";
import useFormContext from "../../../hooks/use-form-context";
import { AiFillDelete } from "react-icons/ai";

function Header({ toggleTheme, handleShowLogin, user }) {
    const theme = useTheme();
    const { getForm, resetForm } = useFormContext();

    // console.log(user);

    const handleSave = async () => {
        toast.promise(saveUserForm(user.email, getForm()), {
            loading: "Saving",
            success: "Character saved",
            error: "Save failed, check network connection",
        });
    };

    const handleResetButton = () => {
        window.confirm("Are you sure you want to reset your character?") &&
            resetForm();
    };

    return (
        <HeaderWrapper>
            <div style={{ display: "flex", gap: "4px" }}>
                <HeaderSmallButton
                    onClick={() => {
                        toggleTheme();
                    }}
                >
                    <BiAdjust />
                </HeaderSmallButton>
                <HeaderSmallButton onClick={handleResetButton}>
                    <AiFillDelete />
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

            <div style={{ display: "flex", gap: "4px" }}>
                {user && (
                    <HeaderSmallButton onClick={handleSave}>
                        <BiSave />
                    </HeaderSmallButton>
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
    );
}

export default Header;
