import { GlobalStyle, ScreenWrapper, StyledApp } from "./styles/Global";
import { useEffect, useState } from "react";
import { StyleSheetManager, ThemeProvider } from "styled-components";
import { light, dark } from "./styles/Theme.styled";
import Header from "./components/common/Header/Header";
import { Toaster } from "react-hot-toast";
import isPropValid from "@emotion/is-prop-valid";
import Login from "./components/common/Login/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PATH_APPROVALS, PATH_HOME } from "./helpers/constants";
import Creator from "./components/Creator";
import Approvals from "./components/approvals/Approvals";

function App() {
    const [theme, setTheme] = useState(
        window.localStorage.getItem("theme") === "dark" ? dark : light
    );
    const [showLogin, setShowLogin] = useState(false);

    const toggleTheme = () => {
        if (theme === light) {
            window.localStorage.setItem("theme", "dark");
            setTheme(dark);
        } else {
            window.localStorage.setItem("theme", "light");
            setTheme(light);
        }
    };

    useEffect(() => {
        console.debug(`Environment: '${process.env.NODE_ENV}'`);
        console.debug(`Debug text: '${process.env.REACT_APP_DEBUG_TEXT}'`);
    }, []);

    const handleShowLogin = () => setShowLogin(true);
    const handleCloseLogin = () => setShowLogin(false);

    return (
        <StyleSheetManager shouldForwardProp={isPropValid}>
            <ThemeProvider theme={theme}>
                <GlobalStyle />
                <StyledApp>
                    <BrowserRouter>
                        <Header
                            toggleTheme={toggleTheme}
                            handleShowLogin={handleShowLogin}
                            // handleLogoClick={() => setActiveTab(tabs[0])}
                        />
                        <ScreenWrapper>
                            <Routes>
                                <Route
                                    path={PATH_HOME}
                                    element={
                                        <Creator
                                            handleShowLogin={handleShowLogin}
                                        />
                                    }
                                />
                                <Route
                                    path={`${PATH_APPROVALS}`}
                                    element={<Approvals />}
                                >
                                    <Route
                                        path=':uid'
                                        element={<Approvals />}
                                    />
                                </Route>
                                <Route path=':any' element={<Creator />} />
                            </Routes>
                            <Login
                                show={showLogin}
                                handleClose={handleCloseLogin}
                            />
                        </ScreenWrapper>
                    </BrowserRouter>
                    <Toaster
                        toastOptions={{
                            style: {
                                background: theme.backgroundRaised,
                                color: theme.textStrong,
                                border: `1px solid ${theme.border}`,
                            },
                        }}
                    />
                </StyledApp>
            </ThemeProvider>
        </StyleSheetManager>
    );
}

export default App;
