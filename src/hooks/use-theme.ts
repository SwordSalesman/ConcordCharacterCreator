import { dark, light } from "@/styles/Theme.styled";
import { useState } from "react";

function useTheme() {
	let defaultTheme =
		typeof window !== "undefined"
			? window.localStorage.getItem("theme") === "dark"
				? "dark"
				: "light"
			: "light";

	const [theme, setTheme] = useState(defaultTheme === "dark" ? dark : light);

	const toggleTheme = () => {
		if (theme.name === "light") {
			typeof window !== "undefined" && window.localStorage.setItem("theme", "dark");
			setTheme(dark);
		} else {
			typeof window !== "undefined" && window.localStorage.setItem("theme", "light");
			setTheme(light);
		}
	};

	return { theme, toggleTheme };
}

export default useTheme;
