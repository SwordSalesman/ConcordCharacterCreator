import { Modal, Tab, Tabs } from "@mui/material";
import Button from "../Button/Button";
import { styled, useTheme } from "styled-components";
import { useEffect, useState } from "react";
import TextInput from "../TextInput/TextInput";
import {
    logInWithEmailAndPassword,
    logout,
    registerWithEmailAndPassword,
    sendPasswordReset,
    signInWithGoogle,
} from "../../../hooks/use-firebase";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-hot-toast";
import { ModalBox } from "../Modal/Modal.style";
import { AiOutlineArrowLeft } from "react-icons/ai";

const allowGoogleSignIn = false;

function Login({ show, handleClose, user }) {
    const theme = useTheme();
    const [tab, setTab] = useState(0);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);

    const [validInputs, setValidInputs] = useState({
        validEmail: true,
        validPassword: true,
        validName: true,
    });

    useEffect(() => {
        setLoading(false);
    }, [user]);

    useEffect(() => {
        setShowForgotPassword(false);
        setLoading(false);
    }, [tab, show]);

    const handleChange = (event, newValue) => {
        setTab(newValue);
    };

    const validateInputs = () => {
        const validName =
            tab === 1 || showForgotPassword || /\w+ \w+/.test(name);
        const validEmail = /(.+@.+\..+)/.test(email);
        const validPassword = showForgotPassword || password.length >= 6;

        setValidInputs({ validEmail, validPassword, validName });
        return validEmail && validPassword && validName;
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();

        if (validateInputs()) {
            if (tab === 0) {
                setLoading(true);
                toast.promise(
                    registerWithEmailAndPassword(name, email, password),
                    {
                        success: () => {
                            setLoading(false);
                            return `Welcome, ${name}!`;
                        },
                        loading: "Signing up...",
                        error: (err) => {
                            setLoading(false);
                            return `Failed to sign up, ${err}`;
                        },
                    }
                );
            } else if (tab === 1) {
                setLoading(true);
                if (showForgotPassword) {
                    toast.promise(sendPasswordReset(email), {
                        success: () => {
                            setLoading(false);
                            setShowForgotPassword(false);
                            return "Sent recovery email to " + email;
                        },
                        loading: "Sending recovery email...",
                        error: (err) => {
                            setLoading(false);
                            return `Failed to send email, ${err}`;
                        },
                    });
                } else {
                    toast.promise(logInWithEmailAndPassword(email, password), {
                        success: () => {
                            setLoading(false);
                            return "Signed in as " + email;
                        },
                        loading: "Signing in...",
                        error: (err) => {
                            setLoading(false);
                            return `Failed to sign in, ${err}`;
                        },
                    });
                }
            }
        }
    };

    const handleLogout = () => {
        setLoading(true);
        logout().then(toast.success("Logged out"));
    };

    const googleSignInButton = allowGoogleSignIn ? (
        <div style={{ width: "100%", padding: "0 10px" }}>
            <Button
                wide
                primary
                onClick={async () => {
                    setLoading(true);
                    signInWithGoogle().then(toast.success("Signed in as "));
                }}
                loading={loading}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignContent: "center",
                        gap: "10px",
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "white",
                            borderRadius: "50%",
                            padding: "1px",
                        }}
                    >
                        <FcGoogle size={18} />
                    </div>
                    <div>Sign in with Google</div>
                </div>
            </Button>
        </div>
    ) : null;

    const tabs = (
        <Tabs
            value={tab}
            onChange={handleChange}
            centered
            sx={{ minHeight: "0", marginBottom: 2 }}
        >
            <Tab
                sx={{
                    padding: "6px 0 6px 0",
                    margin: "0",
                    textTransform: "none",
                    minHeight: "26px",
                    color: theme.text,
                }}
                label='Sign Up'
            />
            <Tab
                sx={{
                    padding: "6px 0 6px 0",
                    margin: "0",
                    textTransform: "none",
                    minHeight: "26px",
                    color: theme.text,
                }}
                label='Log In'
            />
        </Tabs>
    );

    const emailForm = (
        <InputFormFields>
            {tab === 0 && !showForgotPassword && (
                <TextInput
                    value={name}
                    onChange={setName}
                    placeholder='Full Name'
                    title='Full Name'
                    maxRows={1}
                    fixed={true}
                    invalid={!validInputs.validName}
                    invalidText='Enter first and last name'
                />
            )}
            <TextInput
                value={email}
                onChange={setEmail}
                placeholder='Email'
                title='Email'
                trim={true}
                fixed={true}
                invalid={!validInputs.validEmail}
                invalidText='Enter a valid email address'
            />
            {!showForgotPassword && (
                <TextInput
                    value={password}
                    onChange={setPassword}
                    title='Password'
                    placeholder='Password'
                    password={true}
                    invalid={!validInputs.validPassword}
                    invalidText='Password must be at least 6 characters'
                />
            )}
        </InputFormFields>
    );

    const hideForgotPasswordButton = showForgotPassword ? (
        <div>
            <Button onClick={() => setShowForgotPassword(false)}>
                <AiOutlineArrowLeft />
                <p
                    style={{
                        fontSize: "0.8rem",
                        fontStyle: "italic",
                        marginLeft: 6,
                    }}
                >
                    Back to Login
                </p>
            </Button>
        </div>
    ) : null;

    return (
        <Modal
            open={show}
            onClose={handleClose}
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'
        >
            <ModalBox>
                {user ? (
                    <div>
                        <div style={{ margin: "2px 0 10px 0" }}>
                            <p>Signed in as</p>
                            <b>{user.email}</b>
                        </div>
                        <Button
                            wide
                            primary
                            onClick={handleLogout}
                            loading={loading}
                        >
                            Sign Out
                        </Button>
                    </div>
                ) : (
                    <>
                        {tabs}
                        <InputForm onSubmit={handleFormSubmit}>
                            {emailForm}
                            <div style={{ width: "100%", padding: "10px" }}>
                                <Button
                                    wide={true}
                                    primary
                                    loading={loading}
                                    // onClick={(e) => e.preventDefault()}
                                >
                                    {tab === 0 && "Sign Up"}
                                    {tab === 1 &&
                                        (showForgotPassword
                                            ? "Send recovery email"
                                            : "Log In")}
                                </Button>
                            </div>
                        </InputForm>
                        {googleSignInButton}
                        {hideForgotPasswordButton}
                        {tab === 1 && !showForgotPassword && (
                            <Button onClick={() => setShowForgotPassword(true)}>
                                <p
                                    style={{
                                        fontSize: "0.8rem",
                                        fontStyle: "italic",
                                    }}
                                >
                                    Forgotten your password?
                                </p>
                            </Button>
                        )}
                    </>
                )}
            </ModalBox>
        </Modal>
    );
}

export default Login;

const InputForm = styled.form`
    width: 100%;
`;

const InputFormFields = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0px;
    margin-bottom: 10px;
`;
