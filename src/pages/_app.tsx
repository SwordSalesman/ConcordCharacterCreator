import "../styles/globals.css";
import { useEffect, useState } from "react";
import { StyleSheetManager, ThemeProvider } from "styled-components";
import { Toaster } from "react-hot-toast";
import { AppProps } from "next/app";
import { PageMeta } from "./PageMeta";
import { GlobalStyle, ScreenWrapper, StyledApp } from "@/styles/Global";
import { UserContextProvider } from "@/context/userContext";
import { FormContextProvider } from "@/context/formContext";
import { Header } from "@/components/layout/Header";
import useTheme from "@/hooks/use-theme";

export default function App({ Component, pageProps }: AppProps) {
	const [showLogin, setShowLogin] = useState(false);
	const { theme, toggleTheme } = useTheme();

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
				<StyledApp className={theme.name}>
					<UserContextProvider>
						<Header
							toggleTheme={toggleTheme}
							handleShowLogin={handleShowLogin}
							handleLogoClick={() => {}}
						/>
						<ScreenWrapper>
							<Component {...pageProps} />
						</ScreenWrapper>
						<Toaster
							toastOptions={{
								style: {
									background: theme.backgroundRaised,
									color: theme.textStrong,
									border: `1px solid ${theme.border}`,
								},
							}}
						/>
					</UserContextProvider>
				</StyledApp>
			</ThemeProvider>
		</StyleSheetManager>
	);
}
