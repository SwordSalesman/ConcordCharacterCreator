import Creator from "./components/Creator";
import { GlobalStyle, StyledApp } from "./styles/Global";
import { useEffect, useState } from "react";
import { ThemeProvider } from "styled-components";
import { light, dark } from "./styles/Theme.styled";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { auth } from "./hooks/use-firebase";
import { useAuthState } from "react-firebase-hooks/auth";

import RealmPage from "./components/pages/realm/RealmPage";
import SkillsPage from "./components/pages/skills/SkillsPage";
import OptionsPage from "./components/pages/options/OptionsPage";
import BackgroundPage from "./components/pages/background/BackgroundPage";
import ReviewPage from "./components/pages/review/ReviewPage";
import Header from "./components/common/Header/Header";
import IntroPage from "./components/pages/intro/IntroPage";
import Login from "./components/common/Login/Login";
import { ToastContainer, toast } from "react-toastify";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const tabs = [
    { name: "Intro", content: <IntroPage /> },
    { name: "Realm", content: <RealmPage /> },
    { name: "Skills", content: <SkillsPage /> },
    { name: "Options", content: <OptionsPage /> },
    { name: "Background", content: <BackgroundPage /> },
    { name: "Review", content: <ReviewPage /> },
];

function App() {
    const [theme, setTheme] = useState(light);
    const [showLogin, setShowLogin] = useState(false);
    const [user, loading, error] = useAuthState(auth);

    const toggleTheme = () => {
        if (theme === light) {
            setTheme(dark);
        } else {
            setTheme(light);
        }
    };

    const handleShowLogin = () => setShowLogin(true);
    const handleCloseLogin = () => setShowLogin(false);

    useEffect(() => {
        setShowLogin(false);
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
        </ThemeProvider>
    );
}

export default App;
