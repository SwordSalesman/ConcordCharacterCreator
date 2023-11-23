import Creator from "./components/Creator";
import { GlobalStyle, ScreenWrapper, StyledApp } from "./styles/Global";
import { useEffect, useState } from "react";
import { StyleSheetManager, ThemeProvider } from "styled-components";
import { light, dark } from "./styles/Theme.styled";
import { getUserForm, saveUserForm } from "./hooks/use-firebase";

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
import ConfirmModal from "./components/common/Modal/ConfirmModal";
import useUserContext from "./hooks/use-user-context";

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
    const [activeTab, setActiveTab] = useState(tabs[0]);
    const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
    const { user, name } = useUserContext();
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
        toast.promise(saveUserForm(getSimpleForm(), setDateSubmitted, name), {
            loading: "Submitting",
            success: "Character submitted!",
            error: "Submission failed, check network connection",
        });
    };

    const handleSubmit = async () => {
        if (!user) {
            handleShowLogin();
        } else {
            setShowConfirmSubmit(true);
        }
    };

    useEffect(() => {
        console.debug(`Environment: '${process.env.NODE_ENV}'`);
        console.debug(`Debug text: '${process.env.REACT_APP_DEBUG_TEXT}'`);
    }, []);

    useEffect(() => {
        setShowLogin(false);

        const populateForm = async (email) => {
            const formData = await getUserForm(email);

            if (formData) {
                setFormFromSimplifiedData(formData);
                setDateSubmitted(formData.date);
                console.debug(`Data retrieved:`);
                console.debug(formData);

                setShowBanner(true);
            } else {
                console.debug(`No form submission found for user`);
                setTimeout(() => {
                    setShowBanner(true);
                }, 45000);
            }
        };

        if (user) {
            console.debug(`User logged in: ${user.email}`);
            populateForm(user.email);
        } else {
            console.debug("No user logged in.");
            setShowBanner(false);
            setDateSubmitted(null);
            resetForm();
            setTimeout(() => {
                setShowBanner(true);
            }, 45000);
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
                        handleLogoClick={() => setActiveTab(tabs[0])}
                    />
                    <ScreenWrapper>
                        <Banner
                            show={showBanner}
                            dateSubmitted={dateSubmitted}
                        />
                        <Creator
                            tabs={tabs}
                            handleSubmit={handleSubmit}
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                        />
                    </ScreenWrapper>
                    <Login show={showLogin} handleClose={handleCloseLogin} />
                    <ConfirmModal
                        title='Save & Submit Character?'
                        message='You can submit multiple times.'
                        show={showConfirmSubmit}
                        handleClose={(response) => {
                            setShowConfirmSubmit(false);
                            if (!!response) handleSave();
                        }}
                    ></ConfirmModal>
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
