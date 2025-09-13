import "../styles/globals.css";
import { useEffect, useState } from "react";
import { StyleSheetManager, ThemeProvider } from "styled-components";
import { Toaster } from "react-hot-toast";
import { AppProps } from "next/app";
import { dark, light } from "@/styles/Theme.styled";
import { PageMeta } from "./PageMeta";
import { GlobalStyle, ScreenWrapper, StyledApp } from "@/styles/Global";
import { Header } from "@/components/common/Header/Header";

function App({ Component, pageProps }: AppProps) {
	let defaultTheme = "light";
	if (typeof window !== "undefined") {
		defaultTheme = window.localStorage.getItem("theme") || "light";
	}

	const [theme, setTheme] = useState(defaultTheme === "dark" ? dark : light);
	const [showLogin, setShowLogin] = useState(false);

	const toggleTheme = () => {
		if (theme === light) {
			typeof window !== "undefined" && window.localStorage.setItem("theme", "dark");
			setTheme(dark);
		} else {
			typeof window !== "undefined" && window.localStorage.setItem("theme", "light");
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
		<StyleSheetManager>
			<ThemeProvider theme={theme}>
				<PageMeta />
				<GlobalStyle />
				<StyledApp>
					{/* <BrowserRouter> */}
					<Header
						toggleTheme={toggleTheme}
						handleShowLogin={handleShowLogin}
						handleLogoClick={() => {} /* setActiveTab(tabs[0]) */}
					/>
					<ScreenWrapper>
						<Component {...pageProps} />
						{/* <Routes>
								<Route
									path={PATH_HOME}
									element={
										<Creator
											handleShowLogin={handleShowLogin}
											handleCloseLogin={handleCloseLogin}
										/>
									}
								/>
								<Route path={`${PATH_APPROVALS}`} element={<Approvals />}></Route>
								<Route path={`${PATH_GROUPS}`} element={<Groups />}></Route>
								<Route path=":any" element={<Navigate to={PATH_HOME} />} />
							</Routes> */}
						{/* <Login show={showLogin} handleClose={handleCloseLogin} /> */}
					</ScreenWrapper>
					{/* </BrowserRouter> */}
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
