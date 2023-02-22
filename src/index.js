import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { FormContextProvider } from "./context/formContext.js";

const el = document.getElementById("root");
const root = ReactDOM.createRoot(el);

root.render(
  <FormContextProvider>
    <App />
  </FormContextProvider>
);
