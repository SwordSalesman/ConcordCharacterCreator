import "../styles/globals.css";
import { useEffect, useState } from "react";
import { StyleSheetManager, ThemeProvider } from "styled-components";
import { Toaster } from "react-hot-toast";
import { AppProps } from "next/app";
import { PageMeta } from "./PageMeta";

import { Header } from "@/components/layout/Header";
import { dark, light } from "@/styles/Theme.styled";
import UserContextProvider from "@/context/userContext";
import FormContextProvider from "@/context/formContext";

export default function App({ Component, pageProps }: AppProps) {
	// ********************************************** Theme handling, move later
	let defaultTheme =
		typeof window !== "undefined"
			? window.localStorage.getItem("theme") === "dark"
				? "dark"
				: "light"
			: "light";

	const [theme, setTheme] = useState(defaultTheme === "dark" ? dark : light);
	useEffect(() => {
		if (typeof window !== "undefined") {
			document.body.classList.remove("dark", "light");
			document.body.classList.add(theme.name);
		}
	}, [theme]);
	const toggleTheme = () => {
		if (theme.name === "light") {
			typeof window !== "undefined" && window.localStorage.setItem("theme", "dark");
			setTheme(dark);
		} else {
			typeof window !== "undefined" && window.localStorage.setItem("theme", "light");
			setTheme(light);
		}
	};
	useEffect(() => {
		console.debug(`Environment: '${process.env.NODE_ENV}'`);
		console.debug(`Debug text: '${process.env.NEXT_PUBLIC_DEBUG_TEXT}'`);
	}, []);
	// **********************************************

	return (
		<StyleSheetManager>
			<ThemeProvider theme={theme}>
				<PageMeta />
				<UserContextProvider>
					<FormContextProvider>
						<Header toggleTheme={toggleTheme} />
						<Component {...pageProps} />
						<Toaster
							toastOptions={{
								style: {
									background: theme.backgroundRaised,
									color: theme.textStrong,
									border: `1px solid ${theme.border}`,
								},
							}}
						/>
					</FormContextProvider>
				</UserContextProvider>
			</ThemeProvider>
		</StyleSheetManager>
	);
}
