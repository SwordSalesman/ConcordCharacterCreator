import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { FormContextProvider } from "./context/formContext.js";
import { UserContextProvider } from "./context/userContext.js";
import MaintenanceScreen from "./components/MaintenanceScreen.js";

const el = document.getElementById("root");
const root = ReactDOM.createRoot(el);

let site;
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
