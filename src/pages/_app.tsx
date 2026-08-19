import "../styles/globals.css";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { AppProps } from "next/app";
import { PageMeta } from "@/components/layout/PageMeta";

import { Header } from "@/components/layout/Header";
import UserContextProvider from "@/context/userContext";
import FormContextProvider from "@/context/formContext";
import MaintenanceScreen from "./maintenance";

export default function App({ Component, pageProps }: AppProps) {
	const systemTheme =
		typeof window !== "undefined"
			? window.matchMedia("(prefers-color-scheme: dark)").matches
				? "dark"
				: "light"
			: undefined;
	const localStorageTheme =
		typeof window !== "undefined" && window.localStorage.getItem("theme")
			? window.localStorage.getItem("theme") === "dark"
				? "dark"
				: "light"
			: undefined;
	const defaultTheme = localStorageTheme || systemTheme || "light";

	const [themeName, setThemeName] = useState(defaultTheme);

	useEffect(() => {
		if (typeof window !== "undefined") {
			document.body.classList.remove("dark", "light");
			document.body.classList.add(themeName);
		}
	}, [themeName]);

	const toggleTheme = () => {
		const next = themeName === "light" ? "dark" : "light";
		typeof window !== "undefined" && window.localStorage.setItem("theme", next);
		setThemeName(next);
	};

	useEffect(() => {
		console.debug(`Environment: '${process.env.NODE_ENV}'`);
		console.debug(`Debug text: '${process.env.NEXT_PUBLIC_DEBUG_TEXT}'`);
	}, []);

	const maintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE?.toLowerCase() === "true";

	return (
		<>
			<PageMeta />
			<UserContextProvider>
				<FormContextProvider>
					<Header toggleTheme={toggleTheme} />
					{maintenanceMode ? <MaintenanceScreen /> : <Component {...pageProps} />}
					<Toaster
						toastOptions={{
							style: {
								background: "var(--background-raised)",
								color: "var(--foreground)",
								border: "1px solid var(--border)",
							},
						}}
					/>
				</FormContextProvider>
			</UserContextProvider>
		</>
	);
}
