// https://blog.logrocket.com/user-authentication-firebase-react-apps/#:~:text=Integrating%20Firebase%20into%20our%20React%20app&text=const%20app%20%3D%20%E2%80%8B%E2%80%8BinitializeApp,initialize%20authentication%20and%20database%20modules.

import { Modal, Tab, Tabs } from "@mui/material";
import Button from "../Button/Button";
import { styled, useTheme } from "styled-components";
import { useState } from "react";
import TextInput from "../TextInput/TextInput";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import {
    logInWithEmailAndPassword,
    logout,
    registerWithEmailAndPassword,
    signInWithGoogle,
} from "../../../hooks/use-firebase";

function Login({ show, handleClose, user, loading }) {
    const theme = useTheme();
    const [tab, setTab] = useState(0);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const submittable =
        email !== "" &&
        password !== "" &&
        (tab === 1 || (tab === 0 && name !== ""));

    const handleChange = (event, newValue) => {
        setTab(newValue);
    };

    const handlePrimaryButton = () => {
        if (tab === 0) {
            registerWithEmailAndPassword(name, email, password);
        } else if (tab === 1) {
            logInWithEmailAndPassword(email, password);
        }
    };

    const tabs = (
        <Tabs
            value={tab}
            onChange={handleChange}
            textColor={theme.text}
            centered
            sx={{ minHeight: "0" }}
        >
            <Tab
                sx={{
                    padding: "6px 0 6px 0",
                    margin: "0",
                    textTransform: "none",
                    minHeight: "26px",
                }}
                label='Sign Up'
            />
            <Tab
                sx={{
                    padding: "6px 0 6px 0",
                    margin: "0",
                    textTransform: "none",
                    minHeight: "26px",
                }}
                label='Log In'
            />
        </Tabs>
    );

    const emailForm = (
        <InputForm>
            {tab === 0 && (
                <TextInput
                    value={name}
                    onChange={setName}
                    placeholder='Name'
                    title='Name'
                    maxRows={1}
                />
            )}
            <TextInput
                value={email}
                onChange={setEmail}
                placeholder='Email'
                title='Email'
                trim={true}
                email={true}
            />
            <TextInput
                value={password}
                onChange={setPassword}
                title='Password'
                placeholder='Password'
                password={true}
            />
        </InputForm>
    );

    return (
        <Modal
            open={show}
            onClose={handleClose}
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'
        >
            <ModalBox>
                {loading ? (
                    <div>Loading...</div>
                ) : user ? (
                    <Button
                        wide
                        primary
                        onClick={() => {
                            logout();
                        }}
                    >
                        Sign Out
                    </Button>
                ) : (
                    <>
                        {tabs}
                        {emailForm}
                        <div style={{ width: "100%", padding: "0 10px" }}>
                            <Button
                                wide={true}
                                primary={submittable}
                                disabled={!submittable}
                                onClick={() => handlePrimaryButton}
                            >
                                {tab === 0 && "Sign Up"}
                                {tab === 1 && "Log In"}
                            </Button>
                        </div>
                        <div style={{ width: "100%", padding: "0 10px" }}>
                            <Button
                                wide
                                primary
                                onClick={() => {
                                    signInWithGoogle();
                                }}
                            >
                                Sign in with Google
                            </Button>
                        </div>
                        <div
                            style={{ fontSize: "0.8rem", fontStyle: "italic" }}
                        >
                            <a
                                href='https://i.guim.co.uk/img/media/327e46c3ab049358fad80575146be9e0e65686e7/0_0_1023_742/master/1023.jpg?width=620&dpr=1&s=none'
                                target='_blank'
                                rel='noreferrer'
                            >
                                Forgotten your password?
                            </a>
                        </div>
                    </>
                )}
            </ModalBox>
        </Modal>
    );
}

export default Login;

const ModalBox = styled.div`
    position: absolute;
    top: 25%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 350px;
    background-color: ${(props) => props.theme.background};
    border: 1px solid ${(props) => props.theme.border};
    border-radius: 6px;
    box-shadow: 20px;
    padding: 10px 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;

    text-align: center;
    line-height: 1rem;

    box-shadow: 0px 1px 30px 8px ${(props) => props.theme.shadow};
    -webkit-box-shadow: 0px 1px 30px 8px ${(props) => props.theme.shadow};
    -moz-box-shadow: 0px 1px 30px 8px ${(props) => props.theme.shadow};
`;

const InputForm = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 4px;
`;
