// https://blog.logrocket.com/user-authentication-firebase-react-apps/#:~:text=Integrating%20Firebase%20into%20our%20React%20app&text=const%20app%20%3D%20%E2%80%8B%E2%80%8BinitializeApp,initialize%20authentication%20and%20database%20modules.

import { Modal, Tab, Tabs } from "@mui/material";
import Button from "../Button/Button";
import { styled, useTheme } from "styled-components";
import { useEffect, useState } from "react";
import TextInput from "../TextInput/TextInput";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import {
  logInWithEmailAndPassword,
  logout,
  registerWithEmailAndPassword,
  signInWithGoogle,
} from "../../../hooks/use-firebase";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-hot-toast";

const allowGoogleSignIn = false;

function Login({ show, handleClose, user }) {
  const theme = useTheme();
  const [tab, setTab] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const submittable =
    email !== "" &&
    password !== "" &&
    (tab === 1 || (tab === 0 && name !== ""));

  useEffect(() => {
    setLoading(false);
  }, [user]);

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  const handlePrimaryButton = async () => {
    if (tab === 0) {
      setLoading(true);
      toast.promise(registerWithEmailAndPassword(name, email, password), {
        success: "Signed in as " + user.email,
        loading: "Signing up...",
        error: "Failed to sign up, check network connection",
      });
    } else if (tab === 1) {
      setLoading(true);
      toast.promise(logInWithEmailAndPassword(email, password), {
        success: "Signed in as " + email,
        loading: "Signing in...",
        error: "Failed to sign in, check network connection",
      });
    }
  };

  const handleLogout = () => {
    // if (window.confirm("Are you sure you want to sign out?")) {
    setLoading(true);
    logout().then(toast.success("Logged out"));
    // }
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
        {user ? (
          <div>
            <div style={{ margin: "2px 0 10px 0" }}>
              <p>Signed in as</p>
              <b>{user.email}</b>
            </div>
            <Button wide primary onClick={handleLogout} loading={loading}>
              Sign Out
            </Button>
          </div>
        ) : (
          <>
            {tabs}
            {emailForm}
            <div style={{ width: "100%", padding: "0 10px" }}>
              <Button
                wide={true}
                primary={submittable}
                disabled={!submittable}
                onClick={handlePrimaryButton}
                loading={loading}
              >
                {tab === 0 && "Sign Up"}
                {tab === 1 && "Log In"}
              </Button>
            </div>
            {allowGoogleSignIn && (
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
            )}
            {tab === 1 && (
              <div style={{ fontSize: "0.8rem", fontStyle: "italic" }}>
                <a
                  href='https://i.guim.co.uk/img/media/327e46c3ab049358fad80575146be9e0e65686e7/0_0_1023_742/master/1023.jpg?width=620&dpr=1&s=none'
                  target='_blank'
                  rel='noreferrer'
                >
                  Forgotten your password?
                </a>
              </div>
            )}
          </>
        )}
      </ModalBox>
    </Modal>
  );
}

export default Login;

const ModalBox = styled.div`
  position: absolute;
  top: 50%;
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
