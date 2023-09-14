import Creator from "./components/Creator";
import { GlobalStyle, StyledApp } from "./styles/Global";
import { useEffect, useState } from "react";
import { ThemeProvider } from "styled-components";
import { light, dark } from "./styles/Theme.styled";
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
import { Toaster, toast } from "react-hot-toast";
import useFormContext from "./hooks/use-form-context";
import { Banner } from "./components/common/Banner/Banner";

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
    const [dateSubmitted, setDateSubmitted] = useState(null);
    const [user, loading, error] = useAuthState(auth);
    const { getForm, getSimpleForm, setFormFromSimplifiedData } =
        useFormContext();

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

    const handleSave = async () => {
        toast.promise(saveUserForm(getSimpleForm()), {
            loading: "Submitting",
            success: "Character submitted!",
            error: "Submission failed, check network connection",
        });
    };

    const handleSubmit = async () => {
        handleSave();
    };

    const showSubmittedBanner = false;

    useEffect(() => {
        setShowLogin(false);

        const populateForm = async (email) => {
            const formData = await getUserForm(email);
            console.log(formData);
            setFormFromSimplifiedData(formData);
            setDateSubmitted(formData.date);
        };

        if (user) {
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
                    handleSave={handleSave}
                    user={user}
                />
                {showSubmittedBanner && <Banner date={dateSubmitted} />}
                <Creator tabs={tabs} handleSubmit={handleSubmit} />
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
