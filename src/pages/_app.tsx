import "../styles/globals.css";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { AppProps } from "next/app";
import { PageMeta } from "@/components/layout/PageMeta";

import { Header } from "@/components/layout/Header";
import UserContextProvider from "@/context/userContext";
import FormContextProvider from "@/context/formContext";
import { getSiteSettings } from "@/utils/settings";
import MaintenanceScreen from "./maintenance";

export default function App({ Component, pageProps }: AppProps) {
	const defaultTheme =
		typeof window !== "undefined"
			? window.localStorage.getItem("theme") === "dark"
				? "dark"
				: "light"
			: "light";

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
