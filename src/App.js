import Creator from "./components/Creator";
import { GlobalStyle, ScreenWrapper, StyledApp } from "./styles/Global";
import { useEffect, useState } from "react";
import { StyleSheetManager, ThemeProvider } from "styled-components";
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
import isPropValid from "@emotion/is-prop-valid";

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
    const [showBanner, setShowBanner] = useState(false);
    const [dateSubmitted, setDateSubmitted] = useState(null);
    const [user] = useAuthState(auth);
    const { getSimpleForm, setFormFromSimplifiedData, resetForm } =
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
        if (!user) {
            window.alert(
                "You must sign in (on the top right) to submit your character."
            );
            return;
        }
        if (!window.confirm("Are you ready to submit your character?")) return;
        toast.promise(saveUserForm(getSimpleForm(), setDateSubmitted), {
            loading: "Submitting",
            success: "Character submitted!",
            error: "Submission failed, check network connection",
        });
    };

    const handleSubmit = async () => {
        handleSave();
    };

    useEffect(() => {
        setShowLogin(false);

        const populateForm = async (email) => {
            const formData = await getUserForm(email);
            setFormFromSimplifiedData(formData);
            setDateSubmitted(formData.date);

            // This shows the banner after a delay if the user is yet to submit, otherwise immediately
            if (!formData.date) {
                setTimeout(() => {
                    setShowBanner(true);
                }, 20000);
            } else {
                setShowBanner(true);
            }
        };

        if (user) {
            populateForm(user.email);
        } else {
            setShowBanner(false);
            setDateSubmitted(null);
            resetForm();
            setTimeout(() => {
                setShowBanner(true);
            }, 30000);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    return (
        <StyleSheetManager shouldForwardProp={isPropValid}>
            <ThemeProvider theme={theme}>
                <GlobalStyle />
                <StyledApp>
                    <Header
                        toggleTheme={toggleTheme}
                        handleShowLogin={handleShowLogin}
                        handleSave={handleSave}
                        user={user}
                    />
                    <ScreenWrapper>
                        <Banner
                            show={showBanner}
                            dateSubmitted={dateSubmitted}
                        />
                        <Creator tabs={tabs} handleSubmit={handleSubmit} />
                        {showLogin && (
                            <Login
                                show={showLogin}
                                handleClose={handleCloseLogin}
                                user={user}
                            />
                        )}
                    </ScreenWrapper>
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
        </StyleSheetManager>
    );
}

export default App;
