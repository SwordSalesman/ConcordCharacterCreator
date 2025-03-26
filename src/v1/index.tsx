import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { FormContextProvider } from "./context/formContext";
import { UserContextProvider } from "./context/userContext";
import MaintenanceScreen from "./components/MaintenanceScreen";

const el = document.getElementById("root") as HTMLElement; // Add type assertion
const root = ReactDOM.createRoot(el);

let site: JSX.Element; // Add type annotation
if (process.env.REACT_APP_MAINTENANCE_MODE === "TRUE") {
	site = <MaintenanceScreen />;
} else {
	site = (
		<UserContextProvider>
			<FormContextProvider>
				<App />
			</FormContextProvider>
		</UserContextProvider>
	);
}

root.render(site);
