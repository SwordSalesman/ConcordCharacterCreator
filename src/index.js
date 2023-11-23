import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { FormContextProvider } from "./context/formContext.js";
import { UserContextProvider } from "./context/userContext.js";

const el = document.getElementById("root");
const root = ReactDOM.createRoot(el);

root.render(
    <UserContextProvider>
        <FormContextProvider>
            <App />
        </FormContextProvider>
    </UserContextProvider>
);
