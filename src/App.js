import Creator from "./components/Creator";
import { GlobalStyle, StyledApp } from "./styles/Global";
import { useEffect, useState } from "react";
import { ThemeProvider } from "styled-components";
import { light, dark } from "./styles/Theme.styled";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { auth, getUserForm, saveUserForm } from "./hooks/use-firebase";
import { useAuthState } from "react-firebase-hooks/auth";

import RealmPage from "./components/pages/realm/RealmPage";
import SkillsPage from "./components/pages/skills/SkillsPage";
import OptionsPage from "./components/pages/options/OptionsPage";
import BackgroundPage from "./components/pages/background/BackgroundPage";
import ReviewPage from "./components/pages/review/ReviewPage";
import Header from "./components/common/Header/Header";
import IntroPage from "./components/pages/intro/IntroPage";
import Login from "./components/common/Login/Login";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import toast, { Toaster } from "react-hot-toast";
import useFormContext from "./hooks/use-form-context";

const tabs = [
    { name: "Intro", content: <IntroPage /> },
    { name: "Realm", content: <RealmPage /> },
    { name: "Skills", content: <SkillsPage /> },
    { name: "Options", content: <OptionsPage /> },
    { name: "Background", content: <BackgroundPage /> },
    { name: "Review", content: <ReviewPage /> },
];

function App() {
    const [theme, setTheme] = useState(
        window.localStorage.getItem("theme") === "dark" ? dark : light
    );
    const [showLogin, setShowLogin] = useState(false);
    const [user, loading, error] = useAuthState(auth);
    const { setForm } = useFormContext();

    const toggleTheme = () => {
        if (theme === light) {
            window.localStorage.setItem("theme", "dark");
            setTheme(dark);
        } else {
            window.localStorage.setItem("theme", "light");
            setTheme(light);
        }
    };

    const handleShowLogin = () => setShowLogin(true);
    const handleCloseLogin = () => setShowLogin(false);

    useEffect(() => {
        setShowLogin(false);

        const populateForm = async (email) => {
            const formData = await getUserForm(email);
            console.log("retrieved data");
            console.log(formData.form);
            setForm(formData.form);
        };

        if (user) {
            toast.success("Signed in as " + user.email);
            populateForm(user.email);
        }
    }, [user]);

    return (
        <ThemeProvider theme={theme}>
            <GlobalStyle />
            <StyledApp>
                <Header
                    toggleTheme={toggleTheme}
                    handleShowLogin={handleShowLogin}
                    user={user}
                />
                <Creator tabs={tabs} />
                {showLogin && (
                    <Login
                        show={showLogin}
                        handleClose={handleCloseLogin}
                        user={user}
                    />
                )}
            </StyledApp>
            <Toaster
                toastOptions={{
                    style: {
                        background: theme.backgroundRaised,
                        color: theme.textStrong,
                        border: `1px solid ${theme.border}`,
                    },
                }}
            />
        </ThemeProvider>
    );
}

export default App;
